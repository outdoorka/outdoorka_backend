import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel, UserModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status404Codes, status400Codes, status409Codes } from '../types/enum/appStatusCode';
import { Types } from 'mongoose';

export const likedListController = {
  async getlikedListData(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userID = (req as JwtPayloadRequest).user._id;
    const checkUserId = await UserModel.findById(userID);
    let activityTags = [];
    let activityRegions = [];
    let likedList = [];

    if (!checkUserId) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    likedList = await ActivityModel.find(
      { likers: userID },
      'subtitle region city activityImageUrls activityStartTime activityEndTime bookedCapacity'
    ).populate({
      path: 'organizer',
      select: 'name email photo rating socialMediaUrls'
    });

    if (!likedList) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    const tagsAggregation = await ActivityModel.aggregate([
      { $match: { likers: userID } },
      { $unwind: '$activityTags' },
      { $group: { _id: null, tags: { $addToSet: '$activityTags' } } }
    ]);
    if (tagsAggregation.length > 0) {
      activityTags = tagsAggregation[0].tags;
    }

    const regionAggregation = await ActivityModel.aggregate([
      { $match: { likers: userID } },
      { $unwind: '$region' },
      { $group: { _id: null, regions: { $addToSet: '$region' } } }
    ]);
    if (regionAggregation.length > 0) {
      activityRegions = regionAggregation[0].regions;
    }

    const finalRes = {
      activityTags: activityTags,
      region: activityRegions,
      likedList: likedList
    };

    handleResponse(res, finalRes, '取得成功');
  },
  async addlikedList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userID = (req as JwtPayloadRequest).user._id;
    const ObjectId = Types.ObjectId;
    const activityId = req.params.activityID;

    const checkUserId = await UserModel.findById(userID);
    if (!checkUserId) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    const activity = await ActivityModel.findById(activityId);
    if (!activity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    if (activity.likers.includes(userID)) {
      handleAppError(
        409,
        status409Codes[status409Codes.ACTIVITY_ALREADY_ADD],
        status409Codes.ACTIVITY_ALREADY_ADD,
        next
      );
      return;
    }

    activity.likers.push(userID);
    await activity.save();

    handleResponse(res, {}, '活動加入收藏成功');
  },
  async removelikedList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userID = (req as JwtPayloadRequest).user._id;
    const ObjectId = Types.ObjectId;
    const activityId = req.params.activityID;

    const checkUserId = await UserModel.findById(userID);
    if (!checkUserId) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    const activity = await ActivityModel.findById(activityId);
    if (!activity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }

    const index = activity.likers.indexOf(userID);
    if (index === -1) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_LIKE_LIST],
        status404Codes.NOT_FOUND_LIKE_LIST,
        next
      );
      return;
    }

    activity.likers.splice(index, 1);
    await activity.save();

    handleResponse(res, {}, '活動移除收藏成功');
  }
};
