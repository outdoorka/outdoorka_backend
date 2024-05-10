import { Schema, model } from 'mongoose';
import type { IUserModel } from '../types/dto/user';
import { Gender } from '../types/enum/user';
const userSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: 8
    },
    isActive: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2
    },
    mobile: {
      type: String,
      required: [true, 'Mobile is required'],
      trim: true
    },
    photo: {
      type: String,
      default: '',
      trim: true,
      required: false
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: false
    },
    birthday: {
      type: Date,
      required: false
    }
  },
  { versionKey: false }
);

export const UserModel = model('user', userSchema);
