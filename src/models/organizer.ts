import { type Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import type { IOrganizerModel } from '../types/dto/organizer';
import { ActivityTag } from '../types/enum/activity';

const organizerSchema = new Schema<IOrganizerModel, Model<IOrganizerModel>>(
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
      default: false
    },
    username: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2
    },
    nickName: {
      type: String,
      required: [true, 'NickName is required'],
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
    profileTags: {
      type: [String],
      default: [],
      enum: Object.keys(ActivityTag)
    },
    area: {
      type: String,
      default: '',
      trim: true
    },
    socialMediaUrls: {
      fbUrl: { type: String },
      igUrl: { type: String }
    }
  },
  { versionKey: false, timestamps: true }
);

organizerSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const OrganizerModel = model('Organizer', organizerSchema);
