import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { handleAppError, handleErrorAsync, handleResponse } from '../services/handleResponse';
import { UserModel, OrganizerModel } from '../models';
import type { NextFunction, Request, Response } from 'express';
import { status400Codes, status401Codes } from '../types/enum/appStatusCode';
import { type JwtPayloadRequest } from '../types/dto/user';

const ACCESS_TOKEN_SECRET = config.JWT_ACCESS_TOKEN;
const ACCESS_TOKEN_EXPIRES_IN = config.JWT_EXPIRES_DAYS;
const REFRESH_TOKEN_SECRET = config.JWT_REFRESH_TOKEN;
const REFRESH_TOKEN_EXPIRES_IN = config.REFRESH_TOKEN_EXPIRES_IN;

const signAccessToken = (userId: any) => {
  try {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });
    return accessToken;
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
};

const signRefreshToken = (userId: string) => {
  try {
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    return null;
  }
};

// 產生 Token 並回傳
const generatorTokenAndSend = (user: any, res: any) => {
  const token = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  const responseData = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    token: {
      access_token: token,
      expires_in: parseInt(REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
      refresh_token: refreshToken
    }
  };

  handleResponse(res, responseData, '登入成功');
};

const generateAccessToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
    const userId = decoded.userId;

    // 生成新的 accessToken
    const newAccessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    return {
      accessToken: newAccessToken,
      expiresIn: 3600,
      success: true
    };
  } catch (error) {
    return {
      error: 'token無效或過期',
      success: false
    };
  }
};

// 驗證 Token
const isAuth = handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const { authorization } = req.headers;

  // Check Token exist
  if (authorization?.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    handleAppError(
      401,
      status401Codes[status401Codes.UNAUTHORIZED],
      status401Codes.UNAUTHORIZED,
      next
    );
    return;
  }

  // Verify Token
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
  const currentUser = await UserModel.findById(decoded.userId);

  if (!currentUser || !currentUser._id) {
    handleAppError(
      401,
      status401Codes[status401Codes.INVALID_TOKEN],
      status401Codes.INVALID_TOKEN,
      next
    );
    return;
  }

  (req as JwtPayloadRequest).user = currentUser;
  next();
});

// 產生主揪 Token 並回傳
const generatorOrganizerTokenAndSend = (organizer: any, res: any) => {
  const token = signAccessToken(organizer._id);
  const refreshToken = signRefreshToken(organizer._id);
  const responseData = {
    organizer: {
      _id: organizer._id,
      name: organizer.name,
      nickName: organizer.nickName,
      photo: organizer.photo,
      email: organizer.email,
      mobile: organizer.mobile
    },
    token: {
      access_token: token,
      expires_in: parseInt(REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
      refresh_token: refreshToken
    }
  };

  handleResponse(res, responseData, '登入成功');
};

// 驗證主揪 Token
const isOgAuth = handleErrorAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const { authorization } = req.headers;

  // Check Token exist
  if (authorization?.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    handleAppError(
      401,
      status401Codes[status401Codes.UNAUTHORIZED],
      status401Codes.UNAUTHORIZED,
      next
    );
    return;
  }

  // Verify Token
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
  const currentUser = await OrganizerModel.findById(decoded.userId);

  if (!currentUser || !currentUser._id) {
    handleAppError(
      401,
      status401Codes[status401Codes.INVALID_TOKEN],
      status401Codes.INVALID_TOKEN,
      next
    );
    return;
  }

  // 驗證是否啟用
  if (!currentUser.isActive) {
    handleAppError(
      401,
      status400Codes[status400Codes.ACCOUNT_LOCKED],
      status400Codes.ACCOUNT_LOCKED,
      next
    );
    return;
  }

  (req as JwtPayloadRequest).user = currentUser;
  next();
});

const saveResetToken = async (userId: string, token: string, expires: number) => {
  try {
    // 更新使用者紀錄，添加重置token和時間
    await UserModel.findByIdAndUpdate(userId, {
      resetToken: token,
      resetTokenExpire: new Date(expires)
    });
  } catch (error) {
    console.error('Error saving reset token:', error);
    throw error;
  }
};

const verifyResetToken = async (token: string) => {
  console.log('success');
  return await UserModel.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });
};

const updatePassword = async (userId: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await UserModel.findById(userId);
  console.log('User details:', user);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });
};

export {
  signAccessToken,
  generatorTokenAndSend,
  generateAccessToken,
  generatorOrganizerTokenAndSend,
  isAuth,
  isOgAuth,
  saveResetToken,
  verifyResetToken,
  updatePassword
};
