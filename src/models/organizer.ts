import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import type { IOrganizerModel } from '../types/dto/organizer';

const organizerSchema = new Schema<IOrganizerModel>(
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
    phone: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      default: '',
      trim: true
    },
    profileDetail: {
      type: String,
      default: '',
      trim: true
    },
    socialMediaUrls: {
      fbUrl: { type: String },
      igUrl: { type: String }
    }
  },
  { versionKey: false }
);

organizerSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const OrganizerModel = model('Organizer', organizerSchema);
