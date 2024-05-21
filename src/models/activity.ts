import { Schema, model } from 'mongoose';
import { Region, City, ActivityTag } from '../types/enum/activity';
import type { IActivityModel, IActivityLink } from '../types/dto/activity';

const activityLinkLimit = (val: any[]) => {
  return val.length <= 3;
};

const activityImageUrlsLimit = (val: any[]) => {
  return val.length <= 5;
};

// 相關連結
const activityLinkSchema = new Schema<IActivityLink>({
  name: String,
  url: String
});

const activitySchema = new Schema<IActivityModel>(
  {
    organizerId: { type: Schema.Types.ObjectId, required: true, ref: 'Organizer' },
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
    activityLinks: [
      {
        type: [activityLinkSchema],
        trim: true,
        validate: [activityLinkLimit, '{PATH} exceeds the limit of 3']
      }
    ],
    activityImageUrls: [
      {
        type: [String],
        required: true,
        trim: true,
        validate: [activityImageUrlsLimit, '{PATH} exceeds the limit of 5']
      }
    ],
    isPublish: { type: Boolean, required: true },
    activitySignupStartTime: { type: Date, required: true },
    activitySignupEndTime: { type: Date, required: true },
    activityStartTime: { type: Date, required: true },
    activityEndTime: { type: Date, required: true },
    likers: [{ type: [Schema.Types.ObjectId], required: true, ref: 'User' }]
  },
  { versionKey: false }
);

export const ActivityModel = model('Activity', activitySchema);
