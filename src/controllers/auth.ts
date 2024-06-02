import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';
import { UserModel } from '../models/user';
import {
  generatorTokenAndSend,
  generateAccessToken,
  saveResetToken,
  verifyResetToken,
  updatePassword
} from '../services/handleAuth';
import { handleAppError, handleResponse } from '../services/handleResponse';
import { status400Codes, status404Codes, status409Codes } from '../types/enum/appStatusCode';
import type {
  AuthLoginInput,
  AuthRefreshTokenInput,
  AuthRegisterInput,
  AuthForgetPasswordInput,
  AuthResetPasswordInput
} from '../validate/authSchemas';

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
  // 忘記密碼
  async authForgetPassword(
    req: Request<{}, {}, AuthForgetPasswordInput>,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      // 查找用户
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(404).send({ message: '未找到此用戶' });
        return;
      }

      // 生成重置token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const expireTime = Date.now() + 3600000; // token有效期，時間1小時

      // 保存重置token和過期時間到資料庫
      await saveResetToken(user._id, resetToken, expireTime);

      // 設置郵件發送
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: '',
          pass: ''
        }
      });

      const resetUrl = `https://outdoorka-frontend-ten.vercel.app/?token=${resetToken}`;
      const mailOptions = {
        to: email,
        subject: '密碼重置',
        html: `重置的網址: <a href="${resetUrl}">${resetUrl}</a>`
      };

      // 發送信件
      await transporter.sendMail(mailOptions);

      res.send({ message: '重置的密碼連結已寄送至您的信箱' });
    } catch (error) {
      console.error('Error in authForgetPassword:', error);
      res.status(500).send({ message: '伺服器錯誤' });
    }
  },

  // 重置密碼
  async authResetPassword(
    req: Request<{}, {}, AuthResetPasswordInput>,
    res: Response
  ): Promise<void> {
    const { token, password } = req.body;

    try {
      const user = await verifyResetToken(token);

      if (!user) {
        res.status(400).send({ message: '無效的token' });
        return;
      }

      await updatePassword(user._id, password);

      res.send({ message: '密碼重置成功' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send({ message: '伺服器錯誤' });
    }
  },

  async authRefreshAccessToken(
    req: Request<{}, {}, AuthRefreshTokenInput>,
    res: Response
  ): Promise<void> {
    const { refreshToken } = req.body;

    const result = generateAccessToken(refreshToken);

    if (result.success) {
      res.status(200).json({
        data: {
          access_token: result.accessToken,
          expires_in: result.expiresIn
        },
        message: 'token交換成功'
      });
    } else {
      res.status(401).json({
        message: result.error
      });
    }
  }
};
