import jwt from 'jsonwebtoken';
import { config } from '../config';
import { handleAppError, handleResponse } from '../services/handleResponse';
import { UserModel } from '../models/user';
import type { NextFunction, Request, Response } from 'express';
import { status401Codes } from '../types/enum/appStatusCode';
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

// 驗證 Token
const isAuth = async (req: Request, res: Response, next: NextFunction) => {
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
};

// 產生主揪 Token 並回傳
const generatorOrganizerTokenAndSend = (organizer: any, res: any) => {
  const token = signAccessToken(organizer._id);
  const refreshToken = signRefreshToken(organizer._id);
  const responseData = {
    organizer: {
      _id: organizer._id,
      username: organizer.username,
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

export { signAccessToken, generatorTokenAndSend, generatorOrganizerTokenAndSend, isAuth };
