import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel, UserModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status400Codes, status404Codes } from '../types/enum/appStatusCode';
import { Types } from 'mongoose';

export const activityController = {
  async getActivityHomeList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const type = req.query.type;

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
  },
  async getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const activityId = req.params.id;

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
    }

    const _id = (req as JwtPayloadRequest).user._id;
    const checkUserId = await UserModel.findById(_id);

    if (!checkUserId) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const activity = await ActivityModel.findById(activityId).populate({
      path: 'organizer',
      select: 'name, email photo rating socialMediaUrls'
    });

    console.log(activity);
    if (!activity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }
    let isLiked = true;

    const index = activity.likers.findIndex((element) => element.toString() === _id);
    if (index === -1) {
      isLiked = false;
    }

    const finalRes = {
      _id: activity._id,
      title: activity.title,
      subtitle: activity.subtitle,
      address: activity.address,
      location: activity.location,
      region: activity.region,
      activityLinks: activity.activityLinks,
      activityDetail: activity.activityDetail,
      activityNote: activity.activityNotice,
      activityTags: activity.activityTags,
      activityImageUrls: activity.activityImageUrls,
      price: activity.price,
      activitySignupStartTime: activity.activitySignupStartTime,
      activitySignupEndTime: activity.activitySignupEndTime,
      activityStartTime: activity.activityStartTime,
      activityEndTime: activity.activityEndTime,
      bookedCapacity: activity.bookedCapacity,
      remainingCapacity: activity.totalCapacity - activity.bookedCapacity,
      organizer: activity.organizer,
      isLiked
    };

    handleResponse(res, finalRes, '取得成功');
  }
};
