import { Schema, model } from 'mongoose';
import type { IOrganizerRating, IUserRating } from '../types/dto/rating';

const organizerRatingSchema = new Schema<IOrganizerRating>(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 200
    },
    activityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'ActivityId is required'],
      ref: 'Activity'
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      required: [true, 'TicketId is required'],
      ref: 'Ticket'
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'OrganizerId is required'],
      ref: 'Organizer'
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'UserId is required'],
      ref: 'User'
    }
  },
  { versionKey: false, timestamps: true }
);

const userRatingSchema = new Schema<IUserRating>(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 200
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'OrganizerId is required'],
      ref: 'Organizer'
    },
    activityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'ActivityId is required'],
      ref: 'Activity'
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      required: [true, 'TicketId is required'],
      ref: 'Ticket'
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'UserId is required'],
      ref: 'User'
    }
  },
  { versionKey: false, timestamps: true }
);

organizerRatingSchema.index({ activityId: 1 });

export const OrganizerRatingModel = model('OrganizerRating', organizerRatingSchema);
export const UserRatingModel = model('UserRating', userRatingSchema);
