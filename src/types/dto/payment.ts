import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';

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
  paymentStatus: string; // [unpaid", "failed", "paid"]
  paymentCompletedAt: Date;
}
