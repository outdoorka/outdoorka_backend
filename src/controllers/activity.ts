import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models';

import { status400Codes, status404Codes } from '../types/enum/appStatusCode';

export const activityController = {
  async getActivityHomeList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const type = req.query.type;
    // const count = req.query.count;

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
          organizerInfo: '$organizer'
        }
      },
      {
        $sort: type === 'HOT' ? { popularity: -1 } : { activityStartTime: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // }
    // if (type === 'NEW') {
    //   activities = await ActivityModel.find()
    //     .sort({ activityStartTime: 1 }) // 按活動價格升序排序
    //     .limit(10)
    //     .populate({
    //       path: 'organizer',
    //       select: 'username photo rating'
    //     })
    //     .select(
    //       'subtitle region city activityImageUrls activityStartTime activityEndTime bookedCapacity likers'
    //     );
    // }
    if (!activities) {
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
