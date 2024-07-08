import { handleResponse, handleAppError } from '../services/handleResponse';
import type { NextFunction, Request, Response } from 'express';
import { ActivityModel, UserModel, PaymentModel, TicketModel } from '../models';
import { type JwtPayloadRequest } from '../types/dto/user';
import { type ObjectId } from 'mongoose';
import {
  status400Codes,
  status404Codes,
  status409Codes,
  status500Codes
} from '../types/enum/appStatusCode';
import { PaymentStatus } from '../types/enum/payment';
import { TicketStatus } from '../types/enum/ticket';
import { generatePayment, getPaymentResult } from '../services/handleECpay';

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
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const paymentId = (createPayment._id as ObjectId).toString();
    const totalPrice = activity.price * ticketCount;
    const tradeDesc = activity.title;
    const itemName = `${activity.title} * ${ticketCount}`;
    const { html, MerchantTradeNo } = generatePayment(paymentId, totalPrice, tradeDesc, itemName);
    if (!html || !MerchantTradeNo) {
      handleAppError(
        500,
        status500Codes[status500Codes.CREATE_FAILED],
        status500Codes.CREATE_FAILED,
        next
      );
      return;
    }
    createPayment.paymentTradeNo = MerchantTradeNo;
    await createPayment.save();
    handleResponse(res, { _id: createPayment._id, ticketCount, totalPrice, html }, '建立成功');
  },
  async updatePaymentResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { checkMac, data } = getPaymentResult(req.body);
    if (!checkMac) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_MAC],
        status400Codes.INVALID_MAC,
        next
      );
      return;
    }
    if (!data?.MerchantTradeNo) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }
    const paymentRecord = await PaymentModel.findOne({ paymentTradeNo: data.MerchantTradeNo });
    if (!paymentRecord) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_PAYMENT],
        status404Codes.NOT_FOUND_PAYMENT,
        next
      );
      return;
    }
    console.log('CheckMacValue is correct, record the payment details...');
    paymentRecord.paymentStatus = data.RtnCode === '1' ? PaymentStatus.Paid : PaymentStatus.Failed;
    paymentRecord.tradeNo = data.TradeNo;
    paymentRecord.tradeRtnCode = data.RtnCode;
    paymentRecord.tradeAt = new Date();
    const updateResult = await paymentRecord.save();
    if (!updateResult) {
      handleAppError(
        500,
        status500Codes[status500Codes.UPDATE_FAILED],
        status500Codes.UPDATE_FAILED,
        next
      );
      return;
    }

    const reloadedPayment = await PaymentModel.findById(paymentRecord._id);
    const activityInfo = await ActivityModel.findById(paymentRecord.activity);
    if (!reloadedPayment || !activityInfo) {
      handleAppError(
        500,
        status500Codes[status500Codes.SERVER_ERROR],
        status500Codes.SERVER_ERROR,
        next
      );
      return;
    }
    if (reloadedPayment.paymentStatus === PaymentStatus.Paid) {
      const ticketList: any[] = [];
      for (let i = 0; i < reloadedPayment.ticketCount; i++) {
        const newTicket = new TicketModel({
          organizer: activityInfo.organizer,
          activity: reloadedPayment.activity,
          payment: reloadedPayment._id,
          owner: reloadedPayment.buyer,
          ticketStatus: TicketStatus.Unused,
          ticketCreatedAt: new Date(),
          ticketAssignedAt: null,
          ticketNote: '',
          ticketNoteUpdatedAt: null
        });
        ticketList.push(newTicket);
      }
      const saveTickets = await TicketModel.insertMany(ticketList);
      if (!saveTickets) {
        handleAppError(
          500,
          status500Codes[status500Codes.CREATE_FAILED],
          status500Codes.CREATE_FAILED,
          next
        );
        return;
      }
      // update activity bookedCapacity
      const allTicketCount = await TicketModel.countDocuments({
        activity: reloadedPayment.activity
      });
      activityInfo.bookedCapacity = allTicketCount;
      await activityInfo.save();
      res.send('1|OK');
    }
  }
};
