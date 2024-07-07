import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel, UserModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status400Codes, status404Codes } from '../types/enum/appStatusCode';
import { getActivityListSchema, type GetActivityListInput } from '../validate/activitiesSchemas';
import { type SortOrder, Types } from 'mongoose';
import {
  mapCapacityScaleToRange,
  transformedCursor,
  generateCursor
} from '../services/handleActivityList';

export const activityController = {
  // 取得首頁的熱門活動/最新活動資料
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
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
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
          title: 1,
          subtitle: 1,
          region: 1,
          city: 1,
          activityImageUrls: 1,
          activityStartTime: 1,
          activityEndTime: 1,
          likeCount: { $size: '$likers' },
          bookedCapacity: 1,
          popularity: { $divide: ['$bookedCapacity', '$totalCapacity'] },
          organizer: {
            _id: '$organizer._id',
            name: '$organizer.name',
            photo: '$organizer.photo',
            rating: '$organizer.rating'
          }
        }
      },
      {
        $sort: type === 'HOT' ? { popularity: -1 } : { createdAt: -1 }
      },
      {
        $limit: 10
      },
      {
        // 最後的 $project 階段再次排除 createdAt 這樣就可以排序它又不顯示它
        $project: {
          title: 1,
          subtitle: 1,
          region: 1,
          city: 1,
          activityImageUrls: 1,
          activityStartTime: 1,
          activityEndTime: 1,
          // createdAt: 1,
          likeCount: 1,
          bookedCapacity: 1,
          popularity: 1,
          organizer: 1
        }
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

  // 跟團仔角度-取得活動詳細資料
  async getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const activityId = req.params.id;

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
      return;
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
      select: 'name email photo rating socialMediaUrls'
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
    const likeCount = activity.likers.length;
    const index = activity.likers.findIndex((element) => element.toString() === _id);
    if (index === -1) {
      isLiked = false;
    }

    const {
      title,
      subtitle,
      address,
      location,
      region,
      activityLinks,
      activityDetail,
      activityNotice,
      activityTags,
      activityImageUrls,
      price,
      activitySignupStartTime,
      activitySignupEndTime,
      activityStartTime,
      activityEndTime,
      bookedCapacity
    } = activity;
    const finalRes = {
      _id: activity._id,
      title,
      subtitle,
      address,
      location,
      region,
      activityLinks,
      activityDetail,
      activityNote: activityNotice,
      activityTags,
      activityImageUrls,
      price,
      activitySignupStartTime,
      activitySignupEndTime,
      activityStartTime,
      activityEndTime,
      bookedCapacity,
      remainingCapacity: activity.totalCapacity - activity.bookedCapacity,
      organizer: activity.organizer,
      isLiked,
      likeCount
    };

    handleResponse(res, finalRes, '取得成功');
  },
  async getActivityList(
    req: Request<{}, {}, GetActivityListInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const parsedQuery = getActivityListSchema.safeParse(req);
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
    const activitiesTimeQuery = {
      activityStartTime: { $gte: parsedQueryInput.startTime, $lte: parsedQueryInput.endTime }
    };
    const query = {
      ...(parsedQueryInput.startTime && parsedQueryInput.endTime ? activitiesTimeQuery : {}),
      ...(parsedQueryInput.theme ? { theme: { $in: parsedQueryInput.theme } } : {}),
      ...(parsedQueryInput.region ? { region: { $in: parsedQueryInput.region } } : {}),
      ...(parsedQueryInput.capacity
        ? mapCapacityScaleToRange(parsedQueryInput.capacity)
          ? { totalCapacity: mapCapacityScaleToRange(parsedQueryInput.capacity) }
          : {}
        : {}),
      ...(parsedQueryInput.organizerId ? { organizerId: parsedQueryInput.organizerId } : {}),
      ...(parsedQueryInput.keyword
        ? { title: { $regex: parsedQueryInput.keyword, $options: 'i' } }
        : {})
    };
    const queryAfterLookup = {
      ...(parsedQueryInput.rating ? { organizerRating: { $eq: parsedQueryInput.rating } } : {})
    };
    const sortFieldMapping: Record<string, string> = {
      date: 'activityStartTime',
      rating: 'organizerRating',
      capacity: 'totalCapacity',
      price: 'price'
    };
    const [field, order] = parsedQueryInput.sort.split('_');
    const mappedField = sortFieldMapping[field];
    const sort: Record<string, SortOrder> = { [mappedField]: order === 'asc' ? 1 : -1, _id: 1 };

    const aggregateCondition: any = [
      { $match: { ...query, isPublish: true } },
      {
        $lookup: {
          from: 'organizerratings', // 注意這邊是DB的collection名稱(小寫且加s) 不是model名稱
          localField: '_id',
          foreignField: 'activityId',
          as: 'ratings'
        }
      },
      {
        $lookup: {
          from: 'organizers',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      {
        $addFields: {
          organizer: { $arrayElemAt: ['$organizer', 0] }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          subtitle: 1,
          region: 1,
          city: 1,
          price: 1,
          activityImageUrls: 1,
          activitySignupStartTime: 1,
          activitySignupEndTime: 1,
          activityStartTime: 1,
          activityEndTime: 1,
          likeCount: { $size: '$likers' },
          bookedCapacity: 1,
          totalCapacity: 1,
          activityTags: 1,
          organizer: {
            _id: '$organizer._id',
            name: '$organizer.name',
            photo: '$organizer.photo',
            rating: '$organizer.rating'
          }
        }
      },
      {
        $match: queryAfterLookup
      },
      { $sort: sort as Record<string, 1 | -1> }
    ];

    // Pagination logic
    const cursor = parsedQueryInput.cursor;
    const perPage = parsedQueryInput.perPage;
    const direction = parsedQueryInput.direction;
    let directionOperator;
    if (cursor) {
      let cursorValue;
      let cursorObjectId;
      try {
        ({ cursorValue, cursorObjectId } = transformedCursor(field, cursor));
      } catch (error) {
        console.error('CursorId is not a valid value');
        handleAppError(
          400,
          status400Codes[status400Codes.INVALID_VALUE],
          status400Codes.INVALID_VALUE,
          next
        );
      }
      const cursorDirectionOperator = direction === 'forward' ? '$gt' : '$lt';
      if (order === 'asc') {
        directionOperator = direction === 'forward' ? '$gte' : '$lte';
      } else {
        directionOperator = direction === 'forward' ? '$lte' : '$gte';
      }
      aggregateCondition.push({
        $match: {
          $and: [
            { [mappedField]: { [directionOperator]: cursorValue } },
            { _id: { [cursorDirectionOperator]: cursorObjectId } }
          ]
        }
      });
    }
    const perPagePlusOne = perPage + 1;
    const activities = await ActivityModel.aggregate(aggregateCondition).limit(perPagePlusOne);

    const hasNextPage = activities.length === perPagePlusOne;
    if (hasNextPage) {
      // Remove the extra element
      activities.pop();
    }
    const startCursor = activities.length > 0 ? generateCursor(activities[0], mappedField) : null;
    const endCursor =
      activities.length > 0 ? generateCursor(activities[activities.length - 1], mappedField) : null;
    const hasPrevPage = !!cursor;
    const pageInfo = { hasNextPage, hasPrevPage, startCursor, endCursor };
    handleResponse(res, activities, '取得成功', pageInfo);
  }
};
