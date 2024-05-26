import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';

export interface IOrganizerRating extends Document, SchemaTimestampsConfig {
  rating: number;
  comment: string;
  activityId: Types.ObjectId;
  // ticketId: Types.ObjectId;
  organizerId: Types.ObjectId;
  userId: Types.ObjectId;
}
export interface IUserRating extends Document, SchemaTimestampsConfig {
  rating: number;
  comment: string;
  activityId: Types.ObjectId;
  // ticketId: Types.ObjectId;
  organizerId: Types.ObjectId;
  userId: Types.ObjectId;
}
