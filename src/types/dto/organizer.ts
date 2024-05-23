import type { Document, SchemaTimestampsConfig, Types } from 'mongoose';
import type { ActivityTag } from '../enum/activity';

export interface IOrganizerModel extends Document, SchemaTimestampsConfig {
  email: string;
  password: string;
  isActive: boolean;
  name: string;
  nickName: string;
  mobile: string;
  phone: string;
  photo: string;
  profileDetail: string;
  profileTags: ActivityTag[];
  area: string;
  socialMediaUrls: {
    fbUrl: string;
    igUrl: string;
  };
  rating: number;
  // 密碼錯誤次數
  pwdAttempts: number;
}

export interface IOrganizerRating {
  id: Types.ObjectId;
  rating: number;
}
