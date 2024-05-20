import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { generatorTokenAndSend } from '../services/handleAuth';
import { handleAppError, handleResponse } from '../services/handleResponse';
import { status400Codes, status404Codes, status409Codes } from '../types/enum/appStatusCode';
import type { AuthLoginInput, AuthRegisterInput } from '../validate/authSchemas';

export const authController = {
  // 會員註冊
  async authRegister(
    req: Request<{}, {}, AuthRegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = req.body;

    const checkAccount = await UserModel.find({
      $or: [{ email: data.email }, { mobile: data.mobile }]
    });

    if (checkAccount && checkAccount.length > 0) {
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

    const { password, isActive, birthday, createdAt, updatedAt, ...responseData } =
      userData.toObject();
    handleResponse(res, responseData, '註冊成功');
  },
  // 會員登入
  async authLogin(
    req: Request<{}, {}, AuthLoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !user.password) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_CREDENTIALS],
        status400Codes.INVALID_CREDENTIALS,
        next
      );
      return;
    }

    generatorTokenAndSend(user, res);
  },

  async generateAccessToken(req: Request) {
    console.log(req);
  }
};
