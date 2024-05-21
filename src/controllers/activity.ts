import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models';

import { status400Codes, status404Codes } from '../types/enum/appStatusCode';

export const activityController = {
  async getActivityHomeList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const type = req.query.type;
    // const count = req.query.count;

    console.log(type);
    if (!type) {
      handleAppError(
        400,
        status400Codes[status400Codes.MISSING_FIELD],
        status400Codes.MISSING_FIELD,
        next
      );
      return;
    }

    const activities = await ActivityModel.find()
      .populate({
        path: 'organizerId',
        select: 'username photo'
      })
      .select(
        'subtitle region city activityImageUrls activityStartTime activityEndTime bookedCapacity likers organizerId'
      );

    if (!activities) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    handleResponse(res, activities, '取得成功');
  }
};
