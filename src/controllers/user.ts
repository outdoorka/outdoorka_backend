import { handleResponse, handleAppError } from '../services/handleResponse';
import { UserModel } from '../models';
import validator from 'validator';

import type { NextFunction, Request, Response } from 'express';
import { status400Codes, status404Codes, status409Codes } from '../types/enum/appStatusCode';

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
    const checkEmail = await UserModel.exists({ email: data.email.trim() });
    if (checkEmail) {
      handleAppError(
        409,
        status409Codes[status409Codes.ALREADY_EXISTS],
        status409Codes.ALREADY_EXISTS,
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
    const allowedUpdates = ['name', 'mobile', 'photo', 'gender', 'birthday'];

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
  },
  async updateUserEmail(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const updateData = req.body;

    // 檢查是否有 ID 及 email 格式是否正確
    if (!_id || !updateData.email || !validator.isEmail(updateData.email)) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }

    const user = await UserModel.findById(_id, { password: 1 });

    // 確認使用者是否存在
    if (!user) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    // 檢查 password
    if (updateData.password !== user.password) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_CREDENTIALS],
        status400Codes.INVALID_CREDENTIALS,
        next
      );
      return;
    }

    // Define the fields that can be updated
    const allowedUpdates = ['email'];

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
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    handleResponse(res, result, '更新成功');
  },
  async updateUserPassword(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const updateData = req.body;

    // 檢查是否有 ID 及 password 格式是否正確
    if (!_id || !updateData.password || !updateData.newPassword || !updateData.confirmPassword) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }

    const user = await UserModel.findById(_id, { password: 1 });

    // 確認使用者是否存在
    if (!user) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    // 檢查 password
    if (updateData.password !== user.password) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_CREDENTIALS],
        status400Codes.INVALID_CREDENTIALS,
        next
      );
      return;
    }

    // 檢查新密碼是否一致
    if (updateData.newPassword !== updateData.confirmPassword) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_VALUE],
        status400Codes.INVALID_VALUE,
        next
      );
      return;
    }

    const result = await UserModel.findByIdAndUpdate(
      _id,
      { password: updateData.newPassword },
      {
        new: true
      }
    );

    if (!result) {
      handleAppError(
        404,
        status400Codes[status400Codes.INVALID_REQEST],
        status400Codes.INVALID_REQEST,
        next
      );
      return;
    }

    handleResponse(res, result, '更新成功');
  }
};
