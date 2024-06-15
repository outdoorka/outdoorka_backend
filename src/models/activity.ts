import { Schema, model } from 'mongoose';
import { Region, City, ActivityTag } from '../types/enum/activity';
import type { IActivityModel, IActivityLink } from '../types/dto/activity';

// 相關 Array 筆數限制
const activityArrayLimit = (val: any[]) => {
  if (val.length > 5) {
    return false;
  } else {
    return true;
  }
};

// 相關連結
const activityLinkSchema = new Schema<IActivityLink>({
  name: String,
  url: String
});

const activitySchema = new Schema<IActivityModel>(
  {
    organizer: {
      type: Schema.ObjectId,
      required: [true, 'organizer 未填寫'],
      ref: 'Organizer'
    },
    title: { type: String, required: [true, 'title 未填寫'], trim: true, maxlength: 100 },
    subtitle: { type: String, trim: true, maxlength: 100 },
    price: { type: Number, required: [true, 'price 未填寫'] },
    totalCapacity: { type: Number, required: [true, 'totalCapacity 未填寫'] },
    region: { type: String, enum: Object.values(Region), required: [true, 'region 未填寫'] },
    city: { type: String, enum: Object.values(City), required: [true, 'city 未填寫'] },
    address: { type: String, required: [true, 'address 未填寫'], trim: true, maxlength: 100 },
    location: { type: String, required: [true, 'location 未填寫'], trim: true, maxlength: 100 },
    activityDetail: { type: String, required: [true, 'activityDetail 未填寫'], maxlength: 1000 },
    activityNotice: { type: String, required: [true, 'activityNotice 未填寫'], maxlength: 200 },
    activityTags: [
      { type: String, enum: Object.keys(ActivityTag), required: [true, 'activityTags 未填寫'] }
    ],
    activityLinks: [
      {
        type: activityLinkSchema
      }
    ],
    activityImageUrls: [
      {
        type: String
      }
    ],
    isPublish: { type: Boolean, required: true },
    activitySignupStartTime: { type: Date, required: true },
    activitySignupEndTime: { type: Date, required: true },
    activityStartTime: { type: Date, required: true },
    activityEndTime: { type: Date, required: true },
    likers: [{ type: Schema.ObjectId, ref: 'User' }],
    bookedCapacity: { type: Number, default: 0 }
  },
  { versionKey: false, timestamps: true }
);

activitySchema
  .path('activityLinks')
  .validate(activityArrayLimit, '{PATH} 限制最多 5 筆', 'Invalid activityLinks');

activitySchema
  .path('activityImageUrls')
  .validate(activityArrayLimit, '{PATH} 限制最多 5 筆', 'Invalid activityImageUrls');

export const ActivityModel = model('Activity', activitySchema);
