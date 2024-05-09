import { handleResponse, handleAppError } from '../services/handleResponse';
import { UserModel } from '../models';
import validator from 'validator';

import type { NextFunction, Request, Response } from 'express';
import { status400Codes, status404Codes } from '../types/enum/appStatusCode';

export const userController = {
  async getUserList(req: Request, res: Response): Promise<void> {
    const user = await UserModel.find().lean();
    handleResponse(res, user, '取得成功');
  },

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const _id = req.params.id;
    const userData = await UserModel.findOne({ _id }).lean();

    if (!userData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    handleResponse(res, userData, '取得成功');
  },

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body;
    if (!data.email || !data.password || !data.name) {
      handleAppError(
        400,
        status400Codes[status400Codes.REQUIRED_FIELD],
        status400Codes.REQUIRED_FIELD,
        next
      );
      return;
    }

    if (!validator.isEmail(data.email)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
    }

    if (data.mobile && !validator.isMobilePhone(data.mobile, 'zh-TW')) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }

    if (data.photo && !validator.isURL(data.photo)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }

    const userData = await UserModel.create({
      email: data.email,
      password: data.password,
      name: data.name,
      mobile: data.mobile,
      photo: data.photo,
      gender: data.gender,
      birthday: data.birthday
    });
    if (!userData) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    handleResponse(res, userData, '取得成功');
  },
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const checkId = await UserModel.findById(_id);

    if (!checkId) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    await UserModel.findByIdAndDelete(_id);
    handleResponse(res, [], '刪除成功');
  },
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const updateData = req.body;

    // Define the fields that can be updated
    const allowedUpdates = ['name', 'mobile', 'photoUrl', 'gender', 'birthday'];

    // Filter the updateData object to only include allowed fields
    const filteredUpdateData = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce<Record<string, any>>((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const result = await UserModel.findByIdAndUpdate(_id, filteredUpdateData, {
      new: true
    });
    if (!result) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }
    handleResponse(res, result, '更新成功');
  }
};
