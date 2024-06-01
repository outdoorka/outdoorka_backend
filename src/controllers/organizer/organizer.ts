import { handleAppError, handleResponse } from '../../services/handleResponse';
import { ActivityModel, OrganizerModel } from '../../models';
import {
  status404Codes,
  status422Codes,
  status500Codes,
  status400Codes
} from '../../types/enum/appStatusCode';
import { convertCityToArea } from '../../utils/helpers';
import dayjs from 'dayjs';

import type { NextFunction, Request, Response } from 'express';
import { type JwtPayloadRequest } from '../../types/dto/user';
import { type CreateActivitySchemaInput } from '../../validate/activitiesSchemas';
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

    const activity = new ActivityModel({
      ...req.body,
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
        select: 'name, email photo'
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
  }
};
