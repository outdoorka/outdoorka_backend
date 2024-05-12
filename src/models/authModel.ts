import { Schema, model } from 'mongoose';
import type { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import type { LoginModel, AuthResult } from '../types/dto/auth';

const authSchema = new Schema<AuthResult, Model<LoginModel>>({
  email: {
    type: String,
    required: [true, '請輸入您的Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '無效Email，請提供 Email 正確格式']
  },
  password: {
    type: String,
    required: [true, '請輸入您的密碼'],
    trim: true,
    minlength: 8,
    select: false
  }
});

authSchema.pre('save', async function (next) {
  // 加密密碼
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const AuthModel = model('AuthModel', authSchema, 'admin');
