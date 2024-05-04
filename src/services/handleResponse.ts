import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from 'http-errors';

// 回傳成功
export const handleResponse = <T>(res: Response, data: T, message: string = ''): void => {
  res.json({
    data,
    message
  });
};

// 回傳失敗
export const handleErrorResponse = (res: Response, status = 500, error: any): void => {
  res.status(status).send({
    message: error.message,
    error
  });
};

// 回傳已知的自訂錯誤
export const handleAppError = (httpStatus: number, errMessage: string, next: NextFunction) => {
  const error = new Error(errMessage) as any;
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};

// 回傳 Express 應用程式錯誤處理
export const handleAppMainErrorResponse = (dev = 'production', err: HttpError, res: Response) => {
  if (dev === 'dev') {
    // 開發環境錯誤
    res.status(err.statusCode).json({
      message: err.message ?? '系統錯誤',
      error: err,
      stack: err.stack
    });
  } else {
    // 正式環境錯誤
    if (err.isOperational) {
      res.status(err.statusCode).json({
        message: err.message
      });
    } else {
      // log 紀錄
      console.error('出現重大錯誤', err);

      res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
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
