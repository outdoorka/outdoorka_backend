import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { type TicketStatus } from '../enum/ticket';
export interface ITicketModel extends Document, SchemaTimestampsConfig {
  organizer: Types.ObjectId;
  activity: Types.ObjectId;
  payment: Types.ObjectId;
  owner: Types.ObjectId;
  ticketStatus: TicketStatus; // 0:未使用   1:已使用
  ticketCreatedAt: Date;
  ticketAssignedAt: Date;
  ticketNote: string;
  ticketNoteUpdatedAt: Date;
}
