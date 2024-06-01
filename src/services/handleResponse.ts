import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from 'http-errors';
import type { StatusCodeEnum } from '../types/enum/appStatusCode';
import logtail from '../utils/logtail';

// 回傳成功
export const handleResponse = <T>(
  res: Response,
  data: T,
  message: string = '',
  pageInfo?: Record<string, any>
): void => {
  res.json({
    data,
    message,
    pageInfo
  });
};

// 回傳失敗
// export const handleErrorResponse = (res: Response, status = 500, error: any): void => {
//   logtail.error(error.message || '錯誤訊息', error);
//   res.status(status).send({
//     message: error.message,
//     error
//   });
// };

// 回傳已知的自訂錯誤
export const handleAppError = <T>(
  httpStatus: number,
  errorCode: T,
  errorMessage: StatusCodeEnum | string,
  next: NextFunction
) => {
  const error = new Error(errorMessage.toString() || '自訂例外錯誤') as any;
  error.statusCode = httpStatus;
  error.errorCode = errorCode || 999999;
  error.isOperational = true;

  next(error);
};

// 回傳 Express 應用程式錯誤處理
export const handleAppMainErrorResponse = (dev = 'production', err: HttpError, res: Response) => {
  if (dev === 'dev') {
    // 開發環境錯誤
    logtail.error(err.message || '開發系統出現錯誤', err);
    res.status(err.statusCode).json({
      errorMessage: err.message ?? '系統錯誤',
      errorCode: err.errorCode || 999999,
      error: err,
      stack: err.stack
    });
  } else {
    // 正式環境錯誤
    if (err.isOperational) {
      logtail.error(err.message || '錯誤訊息', err);
      res.status(err.statusCode).json({
        errorMessage: err.message,
        errorCode: err.errorCode || 999999
      });
    } else {
      // log 紀錄
      logtail.fatal(err.message || '出現非預期例外錯誤', err);
      res.status(500).json({
        errorMessage: '系統錯誤，請恰系統管理員',
        errorCode: err.errorCode || 999999
      });
    }
  }
};

// 處理非同步錯誤
export const handleErrorAsync = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    func(req, res, next).catch((error) => {
      next(error);
    });
  };
};
