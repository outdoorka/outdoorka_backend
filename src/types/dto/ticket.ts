import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';

export interface ITicketModel extends Document, SchemaTimestampsConfig {
  organizer: Types.ObjectId;
  activity: Types.ObjectId;
  payment: Types.ObjectId;
  owner: Types.ObjectId;
  ticketStatus: number; // 0:未使用   1:已使用
  ticketCreatedAt: Date;
  ticketAssignedAt: Date;
  ticketNote: string;
  ticketNoteUpdatedAt: Date;
}
