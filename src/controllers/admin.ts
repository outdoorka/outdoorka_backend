import type { NextFunction, Request, Response } from 'express';
import { handleAppError, handleResponse } from '../services/handleResponse';
import { OrganizerModel } from '../models';
import { status404Codes } from '../types/enum/appStatusCode';
import { type AuthorizeAccessInput } from '../validate/adminSchemas';

export const adminController = {
  // 管理者開通主揪帳號
  async setAuthorizeAccess(
    req: Request<{}, {}, AuthorizeAccessInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, id } = req.body;

    if (!id || !email) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const getOrganizer = await OrganizerModel.findById(id);

    if (!getOrganizer || getOrganizer.email !== email.toLowerCase()) {
      handleAppError(
        404,
        status404Codes[status404Codes.NOT_FOUND_USER],
        status404Codes.NOT_FOUND_USER,
        next
      );
      return;
    }

    const updateResult = await OrganizerModel.findByIdAndUpdate(
      id,
      { isActive: true },
      {
        new: true
      }
    );

    handleResponse(res, updateResult, '主揪開通成功');
  }
};
