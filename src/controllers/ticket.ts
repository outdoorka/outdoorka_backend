import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { TicketModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status400Codes, status404Codes, status500Codes } from '../types/enum/appStatusCode';
import { Types } from 'mongoose';

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

  async ticketComfirm(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    if (ticketData.ticketStatus === 1) {
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
      { ticketStatus: 1 },
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
    handleResponse(res, { ticketStatus: 1 }, '驗票成功');
  }
};
