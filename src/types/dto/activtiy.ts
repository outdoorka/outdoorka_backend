import type { Document, Types } from 'mongoose';
import type { Region, City, ActivityTag } from '../enum/activity';

export interface IActivityModel extends Document {
  organizerId: Types.ObjectId;
  title: string;
  subtitle: string;
  totalCapacity: number;
  city: City;
  address: string;
  location: string;
  region: Region;
  activityDetails: string;
  activityTags: ActivityTag[];
  activityLinks: string[];
  activityImageUrls: string[];
  price: number;
  isPublish: boolean;
  activitySignupStartTime: Date;
  activitySignupEndTime: Date;
  activityStartTime: Date;
  activityEndTime: Date;
  activityUpdatedAt: Date;
  activityCreatedAt: Date;
  likers: Types.ObjectId[];
}
