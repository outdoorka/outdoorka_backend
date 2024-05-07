import { handleResponse, handleAppError } from '../services/handleResponse';
import { UserModel } from '../models';

import type { NextFunction, Request, Response } from 'express';

export const userSampleController = {
  // 取得全部
  async getUserList(req: Request, res: Response) {
    const user = await UserModel.find().lean();
    handleResponse(res, user, '取得成功');
  },

  // 取得單一User
  async getUser(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const userData = await UserModel.findOne({ _id }).lean();

    if (!userData) {
      handleAppError(404, '找不到使用者', next);
      return;
    }

    handleResponse(res, userData, '取得成功');
  }
};
