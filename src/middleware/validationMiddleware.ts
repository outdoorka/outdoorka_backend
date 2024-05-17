import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { AnyZodObject } from 'zod';
import { handleAppError } from '../services/handleResponse';
import { status422Codes, status500Codes } from '../types/enum/appStatusCode';

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
