import { Schema, model } from 'mongoose';
import type { ITicketModel } from '../types/dto/ticket';

const ticketSchema = new Schema<ITicketModel>(
  {
    organizer: {
      type: Schema.ObjectId,
      required: [true, 'organizer 未填寫'],
      ref: 'Organizer'
    },
    activity: {
      type: Schema.ObjectId,
      required: [true, 'activityId 未填寫'],
      ref: 'Activity'
    },
    payment: {
      type: Schema.ObjectId,
      required: [true, 'paymentId 未填寫'],
      ref: 'Payment'
    },
    owner: {
      type: Schema.ObjectId,
      required: [true, 'ownerId 未填寫'],
      ref: 'User'
    },
    ticketStatus: { type: Number, required: [true, 'ticketStatus 未填寫'] },
    ticketCreatedAt: { type: Date, required: true },
    ticketAssignedAt: { type: Date, required: true },
    ticketNote: { type: String, maxlength: 200 },
    ticketNoteUpdatedAt: { type: Date, required: true }
  },
  { versionKey: false, timestamps: true }
);

export const TicketModel = model('Ticket', ticketSchema);
