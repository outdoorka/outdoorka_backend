import { Schema, model } from 'mongoose';
import type { Model } from 'mongoose';
import type { IUserModel, UserResult } from '../types/dto/sample.user';

const userSchema = new Schema<UserResult, Model<IUserModel>>(
  {
    name: {
      type: String,
      required: [true, '姓名未填寫'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email 未填寫'],
      index: true,
      unique: true,
      lowercase: true,
      select: false,
      trim: true
    },
    photo: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    versionKey: false
  }
);

export const UserSample = model('UserSample', userSchema);
