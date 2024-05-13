import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import type { IUserModel } from '../types/dto/user';
import { Gender } from '../types/enum/user';

const userSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Invalid email format'],
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

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const UserModel = model('User', userSchema);
