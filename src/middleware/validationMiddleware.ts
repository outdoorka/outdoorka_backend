import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { ZodError } from 'zod';
import multer from 'multer';
import { handleAppError } from '../services/handleResponse';
import { status422Codes, status500Codes } from '../types/enum/appStatusCode';
import type { AnyZodObject } from 'zod';

export function validateBody<T extends AnyZodObject>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => {
          console.log(issue.path);
          return { [issue.path.join('.')]: issue.message };
        });

        let getErrorMessage = '';
        try {
          getErrorMessage = JSON.stringify(errorMessages);
        } catch (error: any) {
          getErrorMessage = `例外錯誤: ${error?.message || '無法取得錯誤訊息'}`;
        }

        handleAppError(
          422,
          status422Codes[status422Codes.UNPROCESSABLE_CONTENT],
          getErrorMessage,
          next
        );
      } else {
        console.error('validateBody Error:', error);
        handleAppError(
          500,
          status500Codes[status500Codes.SERVER_ERROR],
          status500Codes.SERVER_ERROR,
          next
        );
      }
    }
  };
}

/**
 * 圖片上傳格式限制 - Middleware
 */
export const validateImage = multer({
  limits: {
    fileSize: config.FILE_SIZE_LIMIT * 1024 * 1024 // 2MB
  },
  fileFilter(req, file, cb) {
    const allowMimetype = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowMimetype.includes(file.mimetype)) {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  }
}).any();
