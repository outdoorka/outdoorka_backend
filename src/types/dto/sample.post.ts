import { type Types } from 'mongoose';

export interface IPostModel {
  user: Types.ObjectId;
  title: string;
  content: string;
  tag: string[];
  image: string;
  likes: string[];
  comments: number;
  isPublic: boolean;
}

export interface PostResult extends IPostModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
