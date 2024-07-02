import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { TicketModel, PaymentModel, UserModel, OrganizerRatingModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import {
  status400Codes,
  status403Codes,
  status404Codes,
  status409Codes,
  status500Codes
} from '../types/enum/appStatusCode';
import { Types } from 'mongoose';
import { TicketStatus } from '../types/enum/ticket';
import { PaymentStatus } from '../types/enum/payment';

export const ticketController = {
  async getTicketData(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const ticketId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;

    if (!ObjectId.isValid(ticketId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
    }

    const ticketData = await TicketModel.findOne({
      _id: ticketId,
      organizer: ogId
    })
      .populate({
        path: 'owner',
        select: 'name mobile'
      })
      .populate({
        path: 'activity',
        select: 'title subtitle activityStartTime activityEndTime activityImageUrls price'
      })
      .select('-organizer')
      .lean();

    if (!ticketData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }

    handleResponse(res, ticketData, '取得成功');
  },

  async ticketConfirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const ticketId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;

    if (!ObjectId.isValid(ticketId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
    }

    const ticketData = await TicketModel.findOne({
      _id: ticketId,
      organizer: ogId
    })
      .populate({
        path: 'owner',
        select: 'name mobile'
      })
      .populate({
        path: 'activity',
        select: 'title subtitle activityStartTime activityEndTime activityImageUrls price'
      })
      .select('-organizer')
      .lean();

    if (!ticketData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }

    if (ticketData.ticketStatus === TicketStatus.Used) {
      handleAppError(
        400,
        status400Codes[status400Codes.TICKET_USED],
        status400Codes.TICKET_USED,
        next
      );
      return;
    }

    const updateResult = await TicketModel.findByIdAndUpdate(
      ticketId,
      { ticketStatus: TicketStatus.Used },
      {
        new: true
      }
    );
    if (!updateResult) {
      handleAppError(
        500,
        status500Codes[status500Codes.SERVER_ERROR],
        status500Codes.SERVER_ERROR,
        next
      );
      return;
    }
    handleResponse(res, { ticketStatus: TicketStatus.Used }, '驗票成功');
  },

  async getOwnerTicketList(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req as JwtPayloadRequest).user._id;

    // 查詢使用者購買的付款記錄
    const payments = await PaymentModel.find({
      buyer: userId,
      paymentStatus: PaymentStatus.Paid
    }).select('_id');

    // 提取付款payment ID
    const paymentIds = payments.map((payment: any) => payment._id);

    const ticketData = await TicketModel.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { payment: { $in: paymentIds } }]
        }
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'payment',
          foreignField: '_id',
          as: 'paymentInfo'
        }
      },
      {
        $unwind: '$paymentInfo'
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activityInfo'
        }
      },
      {
        $unwind: '$activityInfo'
      },
      {
        $group: {
          _id: '$activity',
          activityInfo: { $first: '$activityInfo' },
          paymentInfo: { $first: '$paymentInfo' },
          ticketList: {
            $push: {
              ticketStatus: '$ticketStatus',
              ticketAssignedAt: '$ticketAssignedAt',
              ownerId: '$owner'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          title: '$activityInfo.title',
          bookedCapacity: '$activityInfo.bookedCapacity',
          region: '$activityInfo.region',
          city: '$activityInfo.city',
          activityImageUrl: { $first: '$activityInfo.activityImageUrls' },
          activityStartTime: '$activityInfo.activityStartTime',
          activityEndTime: '$activityInfo.activityEndTime',
          activityExpired: { $lt: ['$activityInfo.activityEndTime', new Date()] },
          paymentId: '$paymentInfo._id',
          paymentBuyer: '$paymentInfo.buyer',
          ticketTotal: { $size: '$ticketList' },
          ticketStatu: {
            $size: {
              $filter: {
                input: '$ticketList',
                as: 'ticket',
                cond: {
                  $and: [
                    { $eq: ['$$ticket.ticketStatus', TicketStatus.Used] },
                    { $eq: ['$$ticket.ownerId', userId] }
                  ]
                }
              }
            }
          },
          ticketAssign: {
            $size: {
              $filter: {
                input: '$ticketList',
                as: 'ticket',
                cond: {
                  $and: [
                    { $eq: ['$$ticket.ticketStatus', TicketStatus.Unused] },
                    { $eq: ['$$ticket.ownerId', userId] },
                    { $eq: ['$$ticket.ticketAssignedAt', null] }
                  ]
                }
              }
            }
          },
          ticketUse: {
            $size: {
              $filter: {
                input: '$ticketList',
                as: 'ticket',
                cond: { $eq: ['$$ticket.ticketStatus', TicketStatus.Used] }
              }
            }
          }
        }
      }
    ]).exec();

    if (!ticketData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }

    handleResponse(res, ticketData, '取得成功');
  },

  async getOwnerTicketInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const USER_ID = (req as JwtPayloadRequest).user._id;
    let paymentId;
    try {
      paymentId = new Types.ObjectId(req.params.id);
    } catch (error) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
      return;
    }

    const ticketData = await TicketModel.aggregate([
      { $match: { payment: paymentId } },
      {
        $lookup: {
          from: 'payments',
          localField: 'payment',
          foreignField: '_id',
          as: 'paymentInfo'
        }
      },
      {
        $unwind: '$paymentInfo'
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activityInfo'
        }
      },
      {
        $unwind: '$activityInfo'
      },
      {
        $lookup: {
          from: 'organizers',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizerInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      {
        $unwind: '$ownerInfo'
      },
      {
        $lookup: {
          from: 'organizerratings',
          let: { activityId: '$activityId', userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$activity', '$$activityId'] }, { $eq: ['$userId', USER_ID] }]
                }
              }
            },
            { $project: { _id: 0, ticketId: 1 } }
          ],
          as: 'rating'
        }
      },
      {
        $group: {
          _id: '$payment',
          activityInfo: { $first: '$activityInfo' },
          organizerInfo: { $first: '$organizerInfo' },
          ratingList: { $first: '$rating' },
          ticketList: {
            $push: {
              ticketId: '$_id',
              ticketStatus: '$ticketStatus',
              ticketNote: '$ticketNote',
              ownerId: '$owner',
              ownerName: '$ownerInfo.name',
              assignedAt: '$ticketAssignedAt'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: '$activityInfo.title',
          subtitle: '$activityInfo.subtitle',
          region: '$activityInfo.region',
          city: '$activityInfo.city',
          price: '$activityInfo.price',
          activityImageUrl: { $first: '$activityInfo.activityImageUrls' },
          activityStartTime: '$activityInfo.activityStartTime',
          activityEndTime: '$activityInfo.activityEndTime',
          activityNotice: '$activityInfo.activityNotice',
          activityExpired: { $lt: ['$activityInfo.activityEndTime', new Date()] },
          organizer: {
            _id: '$activityInfo._id',
            name: { $first: '$organizerInfo.name' },
            photo: { $first: '$organizerInfo.photo' },
            rating: { $first: '$organizerInfo.rating' },
            mobile: { $first: '$organizerInfo.mobile' },
            email: { $first: '$organizerInfo.email' }
          },
          tickets: {
            $filter: {
              input: '$ticketList',
              as: 'ticket',
              cond: { $eq: ['$$ticket.ownerId', USER_ID] }
            }
          },
          ratingList: 1
        }
      }
    ]).exec();

    if (!ticketData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }

    handleResponse(res, ticketData, '取得成功');
  },

  async updateTicketInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = (req as JwtPayloadRequest).user._id;
    let ticketId;
    try {
      ticketId = new Types.ObjectId(req.params.id);
    } catch (error) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
      return;
    }
    const { ownerEmail, ticketNote } = req.body;
    const updateData: {
      owner?: Types.ObjectId;
      ticketNote?: string;
      ticketAssignedAt?: Date;
      ticketNoteUpdatedAt?: Date;
    } = {};

    // 检查ownerEmail和ticketNote是否同时存在
    if (ownerEmail && ticketNote) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        'ownerEmail and ticketNote cannot both be present',
        next
      );
      return;
    }
    const ticketData = await TicketModel.aggregate([
      { $match: { _id: ticketId, owner: userId } }
    ]).exec();
    if (ticketData.length === 0) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_TICKET],
        status404Codes.NOT_FOUND_TICKET,
        next
      );
      return;
    }
    if (ticketData[0].ticketStatus === TicketStatus.Used) {
      handleAppError(403, status403Codes[status403Codes.FORBIDDEN], '票券已使用', next);
      return;
    }
    if (ownerEmail) {
      // only buyer can assign ticket to others
      const checkPayment = await PaymentModel.find({
        buyer: userId,
        paymentStatus: PaymentStatus.Paid,
        _id: ticketData[0].payment
      }).select('_id');
      console.log('checkPayment', checkPayment);
      if (!checkPayment) {
        handleAppError(
          403,
          status403Codes[status403Codes.BUYER_ONLY],
          status403Codes.BUYER_ONLY,
          next
        );
        return;
      }
      // 檢查ownerEmail是否存在User資料庫
      const checkOwnerEmail = await UserModel.findOne({
        email: ownerEmail
      }).select('_id');
      if (!checkOwnerEmail) {
        handleAppError(
          404,
          status404Codes[status404Codes.NOT_FOUND_USER],
          status404Codes.NOT_FOUND_USER,
          next
        );
        return;
      }
      if (checkOwnerEmail._id.toString() === userId.toString()) {
        handleAppError(
          409,
          status409Codes[status409Codes.ASSIGN_TO_SELF_CONFLICT],
          status409Codes.ASSIGN_TO_SELF_CONFLICT,
          next
        );
        return;
      }
      updateData.owner = new Types.ObjectId(checkOwnerEmail._id);
      updateData.ticketAssignedAt = new Date();
    } else if (ticketNote) {
      updateData.ticketNote = ticketNote;
      updateData.ticketNoteUpdatedAt = new Date();
    }
    // 更新票券資訊
    try {
      const updateResult = await TicketModel.findByIdAndUpdate(ticketId, updateData, { new: true });
      handleResponse(res, updateResult, '取得成功');
    } catch (error) {
      console.error(error);
      handleAppError(
        500,
        status500Codes[status500Codes.SERVER_ERROR],
        status500Codes.SERVER_ERROR,
        next
      );
    }
  },
  // 跟團仔評論主揪
  async createRating(req: Request, res: Response, next: NextFunction) {
    const ObjectId = Types.ObjectId;
    const ticketId = req.params.id;
    const userId = (req as JwtPayloadRequest).user._id;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(ticketId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
    }
    const ticketData = await TicketModel.findOne({ _id: ticketId, owner: userId });
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
    const checkRatingData = await OrganizerRatingModel.findOne({ ticketId });
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
      const createRating = await OrganizerRatingModel.create({
        ticket: ticketId,
        rating,
        comment,
        organizerId: ticketData.organizer,
        activityId: ticketData.activity,
        ticketId,
        userId
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
