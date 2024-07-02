import { handleResponse, handleAppError } from '../../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { TicketModel } from '../../models';
import { type JwtPayloadRequest } from '../../types/dto/user';
import { status400Codes, status404Codes } from '../../types/enum/appStatusCode';
import { Types } from 'mongoose';

export const activityOgController = {
  async getActivityParticipant(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ObjectId = Types.ObjectId;
    const activityId = req.params.id;
    const ogId = (req as JwtPayloadRequest).user._id;

    if (!ObjectId.isValid(activityId)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_REQUEST],
        status400Codes.INVALID_REQUEST,
        next
      );
    }

    const ticketData = await TicketModel.find({
      activity: activityId,
      organizer: ogId
    }).populate({
      path: 'owner',
      select: 'name mobile photo'
    });

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
