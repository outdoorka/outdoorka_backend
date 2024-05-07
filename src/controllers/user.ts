import { handleResponse, handleAppError } from '../services/handleResponse';
import { UserModel } from '../models';
import validator from 'validator';

import type { NextFunction, Request, Response } from 'express';

export const userController = {
  async getUserList(req: Request, res: Response): Promise<void> {
    const user = await UserModel.find().lean();
    handleResponse(res, user, '取得成功');
  },

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const _id = req.params.id;
    const userData = await UserModel.findOne({ _id }).lean();

    if (!userData) {
      handleAppError(404, '找不到使用者', next);
      return;
    }
    handleResponse(res, userData, '取得成功');
  },

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body;
    if (data.email) {
      validator.isEmail(data.email);
    }
    if (data.photo) {
      validator.isURL(data.photoUrl);
    }
    const userData = await UserModel.create({
      email: data.email,
      password: data.password,
      name: data.name,
      nickName: data.nickName,
      mobile: data.mobile,
      photo: data.photo,
      gender: data.gender,
      birthday: data.birthday
    });
    if (!userData) {
      handleAppError(404, '找不到使用者', next);
      return;
    }
    handleResponse(res, userData, '取得成功');
  },
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const checkId = await UserModel.findById(_id);

    if (!checkId) {
      handleAppError(404, '找不到使用者', next);
      return;
    }

    await UserModel.findByIdAndDelete(_id);
    handleResponse(res, [], '刪除成功');
  }
};
