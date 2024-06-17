import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel, UserModel, PaymentModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { status404Codes, status409Codes, status500Codes } from '../types/enum/appStatusCode';
import { PaymentStatus } from '../types/enum/payment';
import { generatePayment } from '../services/handleECpay';

export const paymentController = {
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const buyerId = (req as JwtPayloadRequest).user._id;
    const userData = await UserModel.findById(buyerId);
    if (!userData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    const { activityId, ticketCount, buyerName, buyerMobile, buyerEmail } = req.body;
    const activity = await ActivityModel.findById(activityId).where({ isPublish: true });
    if (!activity) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_ACTIVITY],
        status404Codes.NOT_FOUND_ACTIVITY,
        next
      );
      return;
    }
    // Signup Time Check
    const now = new Date();
    const signupStartTime = new Date(activity.activitySignupStartTime);
    const signupEndTime = new Date(activity.activitySignupEndTime);
    if (now < signupStartTime) {
      handleAppError(
        409,
        status409Codes[status409Codes.REGISTRATION_NOT_STARTED],
        status409Codes.REGISTRATION_NOT_STARTED,
        next
      );
      return;
    }

    if (now > signupEndTime) {
      handleAppError(
        409,
        status409Codes[status409Codes.REGISTRATION_CLOSED],
        status409Codes.REGISTRATION_CLOSED,
        next
      );
      return;
    }
    // Capacity Check
    if (activity.bookedCapacity + ticketCount > activity.totalCapacity) {
      handleAppError(
        409,
        status409Codes[status409Codes.REGISTRATION_FULL],
        status409Codes.REGISTRATION_FULL,
        next
      );
      return;
    }
    const payment = new PaymentModel({
      activity: activityId,
      buyer: buyerId,
      buyerInfo: {
        buyerName,
        buyerMobile,
        buyerEmail
      },
      ticketCount,
      ticketPrice: activity.price,
      paymentStatus: PaymentStatus.Unpaid
    });

    const createPayment = await payment.save();
    if (!createPayment?._id) {
      handleAppError(
        500,
        status500Codes[status500Codes.CREATE_FAILED],
        status500Codes.CREATE_FAILED,
        next
      );
      return;
    }
    const totalPrice = activity.price * ticketCount;
    const html = generatePayment(totalPrice);
    handleResponse(res, { _id: createPayment._id, ticketCount, totalPrice, html }, '建立成功');
  },
  async updatePaymentResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    handleResponse(res, [], '更新成功');
  }
};
