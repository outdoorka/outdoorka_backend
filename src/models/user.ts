import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import type { IUserModel } from '../types/dto/user';
import { Gender } from '../types/enum/user';

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

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
      validate: {
        validator: (value: string) => alphanumericRegex.test(value) && value.length >= 8,
        message:
          'Password must be at least 8 characters long and contain only English letters and numbers'
      },
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
      minlength: 2,
      maxlength: 20
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
    },
    resetToken: {
      type: String,
      required: false
    },
    resetTokenExpire: {
      type: Date,
      required: false
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const UserModel = model('User', userSchema);
