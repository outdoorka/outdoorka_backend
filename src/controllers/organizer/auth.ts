import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { OrganizerModel } from '../../models/organizer';
import { generatorOrganizerTokenAndSend } from '../../services/handleAuth';
import { handleAppError, handleResponse } from '../../services/handleResponse';
import { status400Codes, status404Codes, status409Codes } from '../../types/enum/appStatusCode';

export const organizerAuthController = {
  // 主揪登入
  async authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    const organizer = await OrganizerModel.findOne({ email }).select('+password');

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
  async authRegister(req: Request, res: Response, next: NextFunction) {
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
      username: data.username,
      nickName: data.nickName,
      email: data.email,
      mobile: data.mobile,
      profileDetail: data.profileDetail,
      profileTags: data.profileTags,
      area: data.area,
      photo: data.photo,
      password: data.password
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
