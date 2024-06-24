import DOMPurify from 'isomorphic-dompurify';
import { handleAppError, handleResponse } from '../../services/handleResponse';
import { ActivityModel, OrganizerModel, TicketModel, UserRatingModel } from '../../models';
import {
  status404Codes,
  status422Codes,
  status500Codes,
  status400Codes,
  status405Codes,
  status409Codes
} from '../../types/enum/appStatusCode';
import { convertCityToArea } from '../../utils/helpers';
import dayjs from 'dayjs';
import type { NextFunction, Request, Response } from 'express';
import { type JwtPayloadRequest } from '../../types/dto/user';
import {
  type CreateActivitySchemaInput,
  type GetOrganizerActivityInput,
  getOrganizerActivityListSchema
} from '../../validate/activitiesSchemas';
import { Types } from 'mongoose';

export const organizerController = {
  // 取得主揪資料
  async getOrganizer(req: Request, res: Response, next: NextFunction) {
    const ogId = (req as JwtPayloadRequest).user._id;
    const ogData = await OrganizerModel.findById(ogId).lean();

    if (!ogData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const { _id, name, nickName, email, photo, mobile } = ogData;
    handleResponse(
      res,
      {
        _id,
        email,
        name,
        nickName,
        photo,
        mobile
      },
      '取得成功'
    );
  },

  // 主揪建立活動
  async createActivity(
    req: Request<{}, {}, CreateActivitySchemaInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ogId = (req as JwtPayloadRequest).user._id;

    const ogData = await OrganizerModel.findById(ogId);

    if (!ogData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    // 判斷活動的結束時間必須在開始時間之後
    const activityStartTime = dayjs(req.body.activityStartTime);
    const activityEndTime = dayjs(req.body.activityEndTime);
    if (activityEndTime.isBefore(activityStartTime)) {
      handleAppError(
        422,
        status422Codes[status422Codes.INVALID_STARTENDTIME],
        status422Codes.INVALID_STARTENDTIME,
        next
      );
      return;
    }

    // 判斷活動報名的開始時間必須在活動報名的結束時間之前，並且活動報名的結束時間必須在活動開始時間之前
    const signupStartTime = dayjs(req.body.activitySignupStartTime);
    const signupEndTime = dayjs(req.body.activitySignupEndTime);
    if (signupEndTime.isBefore(signupStartTime) || signupStartTime.isAfter(activityStartTime)) {
      handleAppError(
        422,
        status422Codes[status422Codes.INVALID_SIGNUPTIME],
        status422Codes.INVALID_SIGNUPTIME,
        next
      );
      return;
    }

    // 活動區域，會依照 city 來判斷
    const region = convertCityToArea(req.body.city);

    // 活動內容的資料安全判斷 xss
    const cleanActivityDetail = DOMPurify.sanitize(req.body.activityDetail, {
      USE_PROFILES: { html: false }
    });
    // 活動注意事項的資料安全判斷 xss
    const cleanActivityNotice = DOMPurify.sanitize(req.body.activityNotice);

    const activity = new ActivityModel({
      ...req.body,
      activityDetail: cleanActivityDetail,
      activityNotice: cleanActivityNotice,
      region,
      organizer: ogData._id
    });

    const createActivity = await activity.save();

    if (!createActivity || !createActivity._id) {
      handleAppError(
        500,
        status500Codes[status500Codes.CREATE_FAILED],
        status500Codes.CREATE_FAILED,
        next
      );
      return;
    }

    const getActivity = await ActivityModel.findById(createActivity._id).populate({
      path: 'organizer', // 對的 organizer 欄位
      select: 'name, email photo'
    });

    handleResponse(res, getActivity, '取得成功');
  },

  // 主揪更新活動
  async updateActivity(
    req: Request<{}, {}, CreateActivitySchemaInput>,
    res: Response,
    next: NextFunction
  ) {
    // 確認主揪身份
    const ogId = (req as JwtPayloadRequest).user._id;
    const ogData = await OrganizerModel.findById(ogId);
    if (!ogData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    // 確認是否有活動 id
    const activityId = (req as any).params.id;
    if (!activityId) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    // 判斷活動的結束時間必須在開始時間之後
    const activityStartTime = dayjs(req.body.activityStartTime);
    const activityEndTime = dayjs(req.body.activityEndTime);
    if (activityEndTime.isBefore(activityStartTime)) {
      handleAppError(
        422,
        status422Codes[status422Codes.INVALID_STARTENDTIME],
        status422Codes.INVALID_STARTENDTIME,
        next
      );
      return;
    }

    // 判斷活動報名的開始時間必須在活動報名的結束時間之前，並且活動報名的結束時間必須在活動開始時間之前
    const signupStartTime = dayjs(req.body.activitySignupStartTime);
    const signupEndTime = dayjs(req.body.activitySignupEndTime);
    if (signupEndTime.isBefore(signupStartTime) || signupStartTime.isAfter(activityStartTime)) {
      handleAppError(
        422,
        status422Codes[status422Codes.INVALID_SIGNUPTIME],
        status422Codes.INVALID_SIGNUPTIME,
        next
      );
      return;
    }

    const getActivity = await ActivityModel.findById(activityId);
    // 活動不存在
    if (!getActivity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    // 已發佈狀態就不能編輯
    if (getActivity.isPublish) {
      handleAppError(
        405,
        status405Codes[status405Codes.EDIT_NOT_ALLOWED],
        status405Codes.EDIT_NOT_ALLOWED,
        next
      );
      return;
    }

    // 活動區域，會依照 city 來判斷
    const region = convertCityToArea(req.body.city);

    // 活動內容的資料安全判斷 xss
    const cleanActivityDetail = DOMPurify.sanitize(req.body.activityDetail, {
      USE_PROFILES: { html: false }
    });
    // 活動注意事項的資料安全判斷 xss
    const cleanActivityNotice = DOMPurify.sanitize(req.body.activityNotice);

    // 更新活動資料
    getActivity.title = req.body.title;
    getActivity.subtitle = req.body.subtitle;
    getActivity.price = req.body.price;
    getActivity.activityTags = req.body.activityTags as any[];
    getActivity.totalCapacity = req.body.totalCapacity;
    getActivity.city = req.body.city;
    getActivity.address = req.body.address;
    getActivity.region = region;
    getActivity.location = req.body.location;
    getActivity.activityStartTime = req.body.activityStartTime;
    getActivity.activityEndTime = req.body.activityEndTime;
    getActivity.activitySignupStartTime = req.body.activitySignupStartTime;
    getActivity.activitySignupEndTime = req.body.activitySignupEndTime;
    getActivity.activityImageUrls = req.body.activityImageUrls;
    getActivity.activityDetail = cleanActivityDetail;
    getActivity.activityNotice = cleanActivityNotice;
    getActivity.activityLinks = req.body.activityLinks;
    getActivity.isPublish = req.body.isPublish;

    // 儲存活動資料
    const updateResult = await getActivity.save();

    if (!updateResult) {
      handleAppError(
        500,
        status500Codes[status500Codes.UPDATE_FAILED],
        status500Codes.UPDATE_FAILED,
        next
      );
      return;
    }

    // const getActivity = await ActivityModel.findById(updateRresult._id).populate({
    //   path: 'organizer', // 對的 organizer 欄位
    //   select: 'name, email photo'
    // });

    handleResponse(res, updateResult, '更新成功');
  },

  // 取得主揪角度的活動列表
  async getActivities(
    req: Request<{}, {}, GetOrganizerActivityInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const parsedQuery = getOrganizerActivityListSchema.safeParse(req);

    let parsedQueryInput: Record<string, any> = {};
    if (parsedQuery.success) {
      parsedQueryInput = parsedQuery.data.query;
    } else {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
    }

    const ogId = (req as JwtPayloadRequest).user._id;
    const now = new Date();
    const sortOrder = parsedQueryInput.sort === 'asc' ? 1 : -1;
    const status = parsedQueryInput.status;
    const matchStatus: Record<number, any> = {
      0: { isPublish: false, activityStartTime: { $gt: now } }, // 草稿
      1: { isPublish: true, activityStartTime: { $gt: now } }, // 已發佈
      2: { isPublish: true, activityEndTime: { $lt: now } } // 過往活動
    };

    const activityData = await ActivityModel.aggregate([
      {
        $match: {
          organizer: ogId,
          ...matchStatus[status]
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          isPublish: 1,
          totalCapacity: 1,
          bookedCapacity: 1,
          region: 1,
          city: 1,
          address: 1,
          activityImageUrls: 1,
          activityStartTime: 1,
          activityEndTime: 1
        }
      },
      { $sort: { activityStartTime: sortOrder } }
    ]);
    console.log(activityData);

    if (!activityData || activityData.length === 0) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    handleResponse(res, activityData, '取得成功');
  },

  // 取得主揪角度的活動詳細資訊
  async getActivity(req: Request, res: Response, next: NextFunction) {
    const ObjectId = Types.ObjectId;
    const activityId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
    }

    const activityData = await ActivityModel.findOne({
      _id: activityId,
      organizer: ogId
    })
      .populate({
        path: 'organizer', // 對的 organizer 欄位
        select: 'name nickName'
      })
      .lean();

    if (!activityData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    handleResponse(res, activityData, '取得成功');
  },
  // 主揪評論跟團仔
  async createRating(req: Request, res: Response, next: NextFunction) {
    const ObjectId = Types.ObjectId;
    const ticketId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(ticketId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
    }
    const ticketData = await TicketModel.findOne({ _id: ticketId, organizer: ogId });
    if (!ticketData || !ticketData.activity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }
    if (ticketData.ticketStatus !== 1) {
      handleAppError(
        400,
        status400Codes[status400Codes.TICKET_UNUSED],
        status400Codes.TICKET_UNUSED,
        next
      );
      return;
    }
    const checkRatingData = await UserRatingModel.findOne({ ticketId });
    if (checkRatingData) {
      handleAppError(
        409,
        status409Codes[status409Codes.ALREADY_EXISTS],
        status409Codes.ALREADY_EXISTS,
        next
      );
      return;
    }
    try {
      const createRating = await UserRatingModel.create({
        ticket: ticketId,
        rating,
        comment,
        organizerId: ogId,
        activityId: ticketData.activity,
        ticketId,
        userId: ticketData.owner
      });
      handleResponse(res, createRating, '建立成功');
    } catch (error) {
      handleAppError(
        500,
        status500Codes[status500Codes.CREATE_FAILED],
        status500Codes.CREATE_FAILED,
        next
      );
    }
  }
};
