import bcrypt from 'bcrypt';
import { handleResponse, handleAppError } from '../services/handleResponse';
import { UserModel } from '../models';
import validator from 'validator';

import { status400Codes, status404Codes } from '../types/enum/appStatusCode';
import type { ExtendRecord } from '../types/extends';
import type { NextFunction, Request, Response } from 'express';
import { type JwtPayloadRequest } from '../types/dto/user';
import type {
  UserUpdateEmailInput,
  UserUpdateInput,
  UserUpdatePwdInput
} from '../validate/userSchemas';

export const userController = {
  async getUserList(req: Request, res: Response): Promise<void> {
    const user = await UserModel.find().lean();
    handleResponse(res, user, '取得成功');
  },

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const _id = (req as JwtPayloadRequest).user._id;
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
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const _id = (req as JwtPayloadRequest).user._id;
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
  async updateUser(
    req: Request<{}, {}, ExtendRecord<UserUpdateInput>>,
    res: Response,
    next: NextFunction
  ) {
    const _id = (req as JwtPayloadRequest).user._id;
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
  async updateUserEmail(
    req: Request<{}, {}, ExtendRecord<UserUpdateEmailInput>>,
    res: Response,
    next: NextFunction
  ) {
    const _id = (req as JwtPayloadRequest).user._id;
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
    const isPasswordValid = await bcrypt.compare(updateData.password, user.password);
    if (!isPasswordValid) {
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
  async updateUserPassword(
    req: Request<{}, {}, UserUpdatePwdInput>,
    res: Response,
    next: NextFunction
  ) {
    const _id = (req as JwtPayloadRequest).user._id;
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
    const isPasswordValid = await bcrypt.compare(updateData.password, user.password);
    if (!isPasswordValid) {
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

    const newPassword = await bcrypt.hash(updateData.newPassword, 12);
    const result = await UserModel.findByIdAndUpdate(
      _id,
      { password: newPassword },
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
