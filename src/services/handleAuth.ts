import jwt from 'jsonwebtoken';
import { config } from '../config';
import { handleResponse } from '../services/handleResponse';
import { UserModel } from '../models/user';

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

// 產生 Token 並回傳
const generatorTokenAndSend = (user: any, res: any) => {
  const token = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  const responseData = {
    user: {
      id: user._id,
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

// 驗證 Token
const isAuth = async (req: any, res: any) => {
  let token;
  const { authorization } = req.headers;

  // Check Token exist
  if (authorization?.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: '帳號未登入，請先登入' });

  // Verify Token
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

  const currentUser = await UserModel.findById(decoded.id);

  if (!currentUser) return res.status(401).json({ message: '帳號未登入，請先登入' });
  req.user = currentUser;
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
