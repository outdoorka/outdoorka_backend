import { v4 as uuidv4 } from 'uuid';
import logtail from '../utils/logtail';
import { handleAppError, handleResponse } from '../services/handleResponse';
import { status400Codes, status500Codes } from '../types/enum/appStatusCode';
import { handleImageDelete, handleImageUpload } from '../services/handleImageUpload';

import type { NextFunction, Request, Response } from 'express';

export const commonController = {
  async imageUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_FILE],
        status400Codes.INVALID_FILE,
        next
      );
      return;
    }

    const file = files[0];
    const fileName = `images/${uuidv4()}.${file.originalname.split('.').pop()}`;

    handleImageUpload(file, fileName)
      .then((data) => {
        handleResponse(res, data, '上傳成功');
      })
      .catch((error) => {
        logtail.error(error.message || '非預期圖片上傳失敗', error);
        handleAppError(
          500,
          status500Codes[status500Codes.UPLOAD_FAILED],
          status500Codes.UPLOAD_FAILED,
          next
        );
      });
  },
  async imageDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const fileName = req.query.fileName;
    if (!fileName || typeof fileName !== 'string') {
      handleAppError(
        400,
        status400Codes[status400Codes.INVALID_FILE],
        status400Codes.INVALID_FILE,
        next
      );
      return;
    }

    handleImageDelete(fileName)
      .then(() => {
        handleResponse(res, null, '刪除成功');
      })
      .catch((error) => {
        logtail.error(error.message || '非預期圖片刪除失敗', error);
        handleAppError(
          500,
          status500Codes[status500Codes.DELETE_FAILED],
          status500Codes.DELETE_FAILED,
          next
        );
      });
  }
};
