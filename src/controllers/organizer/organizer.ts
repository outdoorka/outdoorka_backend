import { handleAppError, handleResponse } from '../../services/handleResponse';
import { ActivityModel, OrganizerModel } from '../../models';
import { status404Codes, status500Codes } from '../../types/enum/appStatusCode';
import { convertCityToArea } from '../../utils/helpers';

import type { NextFunction, Request, Response } from 'express';
import { type JwtPayloadRequest } from '../../types/dto/user';
import { type CreateActivitySchemaInput } from '../../validate/activitiesSchemas';

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
  }
};
