import type { Document } from 'mongoose';
import type { ActivityTag } from '../enum/activity';

export interface IOrganizerModel extends Document {
  email: string;
  password: string;
  isActive: boolean;
  name: string;
  mobile: string;
  phone: string;
  photo: string;
  profileDetail: string;
  organizerCreatedAt: Date;
  profileTags: ActivityTag[];
  activate: boolean;
  socialMediaUrls: {
    fbUrl: string;
    igUrl: string;
  };
}
