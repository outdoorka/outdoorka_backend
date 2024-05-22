import express from 'express';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoDbConnection from './connections/mongoose';
import { handleAppMainErrorResponse } from './services/handleResponse';
import { routeNotFound } from './middleware/routeNotFound';
import { config } from './config';
import logtail from './utils/logtail';

// types
import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from 'http-errors';

// swagger
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json';

// router
import userRouter from './routes/user';
import adminRouter from './routes/admin';
import authRouter from './routes/auth';
import organizerRouter from './routes/organizer';

// const USER_BASE_URL = '/api/v1';
// const ORGANIZER_BASE_URL = '/api/v1/organizer';

// Validate Config
config.validateConfig();
logtail.info('Express Server Init');
// MongoDB Connection
mongoDbConnection();

const app = express();

// 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaught Exception！');
  console.error(err);
  process.exit(1);
});

// Express Middlewares
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json()); // { limit: '10mb' } 可調整請求大小限制.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route
// swagger api 文件不援使用帶變數的方式
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/organizer', organizerRouter);
app.use('/api/v1', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404
app.use(routeNotFound);

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  err.statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
  } else if (
    err.name === 'TypeError' &&
    err.message === 'Expected a string but received a undefined'
  ) {
    err.message = '資料欄位格式未填寫正確，請重新輸入！';
    err.isOperational = true;
  }
  handleAppMainErrorResponse(process.env.NODE_ENV, err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (err: any, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
  process.exit(1);
});

export default app;
