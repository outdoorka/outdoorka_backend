import { Schema, model, Types } from 'mongoose';
import { Region, City, ActivityTag } from '../types/enum/activity';

const activitySchema = new Schema(
  {
    organizerId: { type: Types.ObjectId, required: true, ref: 'Organizer' },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    subtitle: { type: String, trim: true, maxlength: 100 },
    price: { type: Number, required: true },
    totalCapacity: { type: Number, required: true },
    region: { type: String, enum: Object.values(Region), required: true },
    city: { type: String, enum: Object.values(City), required: true },
    address: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    activityDetail: { type: String, required: true, maxlength: 1000 },
    activityNotice: { type: String, required: true, maxlength: 200 },
    activityTags: [{ type: String, enum: Object.values(ActivityTag), required: true }],
    activityLinks: [{ type: String, trim: true }],
    activityImageUrls: [{ type: String, required: true, trim: true }],
    isPublish: { type: Boolean, required: true },
    activitySignupStartTime: { type: Date, required: true },
    activitySignupEndTime: { type: Date, required: true },
    activityStartTime: { type: Date, required: true },
    activityEndTime: { type: Date, required: true },
    activityUpdatedAt: { type: Date, required: true },
    activityCreatedAt: { type: Date, required: true },
    likers: [{ type: Types.ObjectId, required: true, ref: 'User' }],
    bookedCapacity: { type: Number, required: true }
  },
  { versionKey: false }
);

export const ActivityModel = model('Activity', activitySchema);
