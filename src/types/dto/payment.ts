import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import type { PaymentStatus } from '../enum/payment';

export interface IPaymentModel extends Document, SchemaTimestampsConfig {
  activity: Types.ObjectId;
  buyer: Types.ObjectId;
  buyerInfo: {
    buyerName: string;
    buyerMobile: string;
    buyerEmail: string;
  };
  ticketCount: number;
  ticketPrice: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentCompletedAt: Date;
}
