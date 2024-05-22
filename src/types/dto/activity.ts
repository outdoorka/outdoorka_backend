import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import type { Region, City, ActivityTag } from '../enum/activity';

export interface IActivityModel extends Document, SchemaTimestampsConfig {
  organizer: Types.ObjectId;
  title: string;
  subtitle: string;
  totalCapacity: number;
  city: City;
  address: string;
  location: string;
  region: Region;
  activityDetail: string;
  activityNotice: string;
  activityTags: ActivityTag[];
  activityLinks: IActivityLink[];
  activityImageUrls: string[];
  price: number;
  isPublish: boolean;
  activitySignupStartTime: Date;
  activitySignupEndTime: Date;
  activityStartTime: Date;
  activityEndTime: Date;
  likers: Types.ObjectId[];
}

export interface IActivityLink {
  name: string;
  url: string;
}
