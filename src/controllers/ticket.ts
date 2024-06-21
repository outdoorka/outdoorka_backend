import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { TicketModel, PaymentModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status400Codes, status404Codes, status500Codes } from '../types/enum/appStatusCode';
import { Types } from 'mongoose';
import { TicketStatus } from '../types/enum/ticket';
import { PaymentStatus } from '../types/enum/payment';

export const ticketController = {
  async getTicketData(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const ticketId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;
    console.log(ogId);
    if (!ObjectId.isValid(ticketId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
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
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
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

  async getOwnerTicketData(req: Request, res: Response, next: NextFunction): Promise<void> {
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
          tickets: {
            $push: {
              ticketId: '$_id',
              ticketStatus: '$ticketStatus',
              ticketOwnerId: '$owner'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: '$activityInfo.title',
          bookedCapacity: '$activityInfo.bookedCapacity',
          region: '$activityInfo.region',
          city: '$activityInfo.city',
          activityImageUrl: { $first: '$activityInfo.activityImageUrls' },
          activityStartTime: '$activityInfo.activityStartTime',
          activityEndTime: '$activityInfo.activityEndTime',
          // likers: { $size: '$activityInfo.likers' },
          paymentId: '$paymentInfo._id',
          paymentBuyer: '$paymentInfo.buyer',
          ticketCount: { $size: '$tickets' },
          tickets: 1
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
  }
};
