import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models';

import { status400Codes, status404Codes } from '../types/enum/appStatusCode';

export const activityController = {
  async getActivityHomeList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const type = req.query.type;
    const count = req.query.count;
    console.log(count);
    if (!type) {
      handleAppError(
        400,
        status400Codes[status400Codes.MISSING_FIELD],
        status400Codes.MISSING_FIELD,
        next
      );
      return;
    }

    if (!(type === 'HOT' || type === 'NEW')) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    const activities = await ActivityModel.aggregate([
      { $match: { isPublish: true } },
      {
        $lookup: {
          from: 'organizers', // 關聯的集合名
          localField: 'organizer', // 原集合中的欄位
          foreignField: '_id', // 關聯的 _id
          as: 'organizer' // 關聯查询结果的输出
        }
      },
      {
        $addFields: {
          organizer: { $arrayElemAt: ['$organizer', 0] }
        }
      },
      {
        $project: {
          subtitle: 1,
          region: 1,
          city: 1,
          activityImageUrls: 1,
          activityStartTime: 1,
          activityEndTime: 1,
          likers: { $size: '$likers' },
          bookedCapacity: 1,
          popularity: { $divide: ['$bookedCapacity', '$totalCapacity'] },
          organizer: {
            _id: '$organizer._id',
            name: '$organizer.username',
            photo: '$organizer.photo',
            rating: '$organizer.rating'
          }
        }
      },

      {
        $sort: type === 'HOT' ? { popularity: -1 } : { activityStartTime: -1 }
      },
      {
        $limit: 10
      }
    ]);

    if (!activities || activities.length === 0) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    handleResponse(res, activities, '取得成功');
  }
};
