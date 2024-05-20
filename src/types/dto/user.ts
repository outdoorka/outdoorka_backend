import type { Document, SchemaTimestampsConfig } from 'mongoose';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface IUserModel extends Document, SchemaTimestampsConfig {
  email: string;
  password: string;
  isActive: boolean;
  name: string;
  mobile: string;
  photo: string;
  gender: string;
  birthday: Date;
}

export interface JwtPayloadRequest extends Request {
  user: JwtPayload;
}
