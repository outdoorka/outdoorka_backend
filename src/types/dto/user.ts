import type { Document } from 'mongoose';

export interface IUserModel extends Document {
  email: string;
  password: string;
  isActive: boolean;
  name: string;
  nickName: string;
  mobile: string;
  photo: string;
  gender: string;
  birthday: Date;
}
