import { type Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import type { IOrganizerModel, IOrganizerRating } from '../types/dto/organizer';
import { ActivityTag } from '../types/enum/activity';

// 會員評分
const ratingSchema = new Schema<IOrganizerRating>({
  id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    max: 5
  }
});

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
    name: {
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
    },
    rating: {
      type: [ratingSchema]
    },
    pwdAttempts: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false, timestamps: true }
);

organizerSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const OrganizerModel = model('Organizer', organizerSchema);
