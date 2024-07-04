import { config } from '../config';
import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import logtail from '../utils/logtail';
import { UserModel } from '../models/user';
import { handleSendMail } from '../services/handleSendMail';
import {
  generatorTokenAndSend,
  generateAccessToken,
  saveResetToken,
  verifyResetToken,
  updatePassword,
  signAccessToken
} from '../services/handleAuth';
import { handleAppError, handleResponse } from '../services/handleResponse';
import {
  status400Codes,
  status404Codes,
  status409Codes,
  status500Codes
} from '../types/enum/appStatusCode';
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

    if (!user || !user.password || !!user.providerId) {
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
  // 會員忘記密碼
  async authForgetPassword(
    req: Request<{}, {}, AuthForgetPasswordInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

    const resetUrl = `${config.FRONTEND_URL}/reset-pwd/${resetToken}/`;
    const content = `
        <p>親愛的會員 您好，</p>
        <p>請點擊以下連結重置您的密碼：</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>若您未要求重置密碼，請忽略此信。</p>
        <br>
        <p><a href="${config.FRONTEND_URL}">OutdoorKA</a> 團隊敬上</p>
      `;
    handleSendMail(email, 'OutdoorKA 會員密碼重置', content)
      .then(() => {
        handleResponse(res, null, '重置的密碼連結已寄送至您的信箱');
      })
      .catch((err) => {
        logtail.error('Send Mail Error', { email, error: err });
        handleAppError(
          500,
          status500Codes[status500Codes.SEND_EMAIL_FAILED],
          status500Codes.SEND_EMAIL_FAILED,
          next
        );
      });
  },
  // 會員重置密碼
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
  },

  // 會員 Google OAuth 2.0 callback
  async authGoogleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    const profile: any = req.user;
    if (!profile.id || !profile.provider || !profile.name || !profile.email) {
      res.redirect(`${config.FRONTEND_URL}/login?error=google-auth-fail`);
    }

    UserModel.findOrCreate({
      providerId: `${profile.provider}-${profile.id}`,
      name: profile.name,
      email: profile.email,
      photo: profile.photo
    }).then((user: any) => {
      if (!user?._id) {
        res.redirect(`${config.FRONTEND_URL}/login?error=google-auth-fail`);
      } else {
        const getSignAccessToken = signAccessToken(user._id);
        if (getSignAccessToken) {
          res.redirect(`${config.FRONTEND_URL}/auth/callback/${getSignAccessToken}`);
        } else {
          res.redirect(`${config.FRONTEND_URL}/login?error=token-auth-fail`);
        }
      }
    });
  }
};
