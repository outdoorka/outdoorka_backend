import { config } from '../../config';
import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import logtail from '../../utils/logtail';
import { handleSendMail } from '../../services/handleSendMail';
import { OrganizerModel } from '../../models/organizer';
import {
  generatorOrganizerTokenAndSend,
  getResetPwdToken,
  verifyResetPwdToken
} from '../../services/handleAuth';
import { handleAppError, handleResponse } from '../../services/handleResponse';
import {
  status400Codes,
  status401Codes,
  status404Codes,
  status409Codes,
  status500Codes
} from '../../types/enum/appStatusCode';
import type { OgAuthRegisterInput, OgLoginInput } from '../../validate/organizerSchemas';
import { type AuthResetPasswordInput } from '../../validate/authSchemas';

export const organizerAuthController = {
  // 主揪登入
  async authLogin(
    req: Request<{}, {}, OgLoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    const organizer = await OrganizerModel.findOne({ email }).select('+password').lean();

    if (!organizer?.password) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, organizer.password);

    if (!isPasswordValid) {
      const attempts = organizer.pwdAttempts + 1;
      await OrganizerModel.findByIdAndUpdate(organizer._id, {
        pwdAttempts: attempts
      });

      logtail.error(`主揪登入密碼錯誤 attempts: ${attempts}`, { email: organizer.email });

      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_CREDENTIALS],
        status400Codes.INVALID_CREDENTIALS,
        next
      );
      return;
    }

    if (organizer.pwdAttempts > 5) {
      handleAppError(
        400,
        status400Codes[status400Codes.PASSWORD_ATTEMPTS],
        status400Codes.PASSWORD_ATTEMPTS,
        next
      );
      return;
    }

    generatorOrganizerTokenAndSend(organizer, res);
  },
  // 主揪註冊
  async authRegister(req: Request<{}, {}, OgAuthRegisterInput>, res: Response, next: NextFunction) {
    const data = req.body;

    const checkAccount = await OrganizerModel.find({
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

    const userData = await OrganizerModel.create({
      name: data.name,
      nickName: data.nickName,
      email: data.email,
      mobile: data.mobile,
      profileDetail: data.profileDetail,
      profileTags: data.profileTags,
      area: data.area,
      photo: data.photo,
      password: data.password,
      isActive: false
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

    const { password, ...responseData } = userData.toObject();
    handleResponse(res, responseData, '註冊成功');
  },
  // 忘記密碼
  async authForgetPassword(
    req: Request<{}, {}, OgAuthRegisterInput>,
    res: Response,
    next: NextFunction
  ) {
    const { email } = req.body;
    const getToken = getResetPwdToken(email);

    const resetUrl = `${config.FRONTEND_URL}?token=${getToken}`;
    const content = `
      <p>主揪 您好，</p>
      <p>請點擊以下連結重置您的密碼：</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>若您未要求重置密碼，請忽略此信。</p>
      <br>
      <p><a href="${config.FRONTEND_URL}">OutdoorKA</a> 團隊敬上</p>
    `;

    handleSendMail(email, 'OutdoorKA 主揪密碼重置', content)
      .then((sendResult) => {
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
  // 更新主揪密碼
  async authResetPassword(
    req: Request<{}, {}, AuthResetPasswordInput>,
    res: Response,
    next: NextFunction
  ) {
    const { token, password } = req.body;

    const verifyToken = verifyResetPwdToken(token);

    if (!verifyToken?.email || !verifyToken.role || verifyToken.role !== 'organizer') {
      handleAppError(
        400,
        status401Codes[status401Codes.INVALID_TOKEN],
        status401Codes.INVALID_TOKEN,
        next
      );
      return;
    }

    const organizer = await OrganizerModel.findOne({ email: verifyToken.email });

    if (!organizer) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    organizer.password = password;
    organizer.pwdAttempts = 0;

    organizer
      .save()
      .then(() => {
        handleResponse(res, null, '密碼重置成功');
      })
      .catch((err) => {
        logtail.error('Reset Password Error', { email: organizer.email, error: err });
        handleAppError(
          500,
          status500Codes[status500Codes.SERVER_ERROR],
          status500Codes.SERVER_ERROR,
          next
        );
      });
  }
};
