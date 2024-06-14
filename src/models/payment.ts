import { Schema, model } from 'mongoose';
import validator from 'validator';
import type { IPaymentModel } from '../types/dto/payment';
import { PaymentStatus } from '../types/enum/payment';

const paymentSchema = new Schema<IPaymentModel>(
  {
    activity: {
      type: Schema.Types.ObjectId,
      required: [true, 'activityId 未填寫'],
      ref: 'Activity'
    },
    buyer: {
      type: Schema.Types.ObjectId,
      required: [true, 'buyerId 未填寫'],
      ref: 'User'
    },
    buyerInfo: {
      buyerName: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 20
      },
      buyerMobile: {
        type: String,
        required: [true, 'Mobile is required'],
        trim: true
      },
      buyerEmail: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Invalid email format'],
        lowercase: true,
        trim: true
      }
    },
    ticketCount: { type: Number, required: [true, 'ticketCount 未填寫'] },
    ticketPrice: { type: Number, required: [true, 'ticketPrice 未填寫'] },
    paymentMethod: { type: String, maxlength: 100 }, // TODO 看看需不需要定義enum
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: [true, 'paymentStatus 未填寫']
    },
    paymentCompletedAt: { type: Date, default: null }
  },
  { versionKey: false, timestamps: true }
);

export const PaymentModel = model('Payment', paymentSchema);
