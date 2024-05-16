import type { Document, SchemaTimestampsConfig } from 'mongoose';
import type { ActivityTag } from '../enum/activity';

export interface IOrganizerModel extends Document, SchemaTimestampsConfig {
  email: string;
  password: string;
  isActive: boolean;
  username: string;
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
}
