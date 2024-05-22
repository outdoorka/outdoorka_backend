import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import logtail from '../../utils/logtail';
import { OrganizerModel } from '../../models/organizer';
import { generatorOrganizerTokenAndSend } from '../../services/handleAuth';
import { handleAppError, handleResponse } from '../../services/handleResponse';
import { status400Codes, status404Codes, status409Codes } from '../../types/enum/appStatusCode';
import type { OgAuthRegisterInput, OgLoginInput } from '../../validate/organizerSchemas';

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
  }
};
