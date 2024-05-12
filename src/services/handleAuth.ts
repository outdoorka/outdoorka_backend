import jwt from 'jsonwebtoken';
import { handleResponse } from '../services/handleResponse';
import { AuthModel } from '../models/authModel';

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN || '';
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN || '';
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '';

const signAccessToken = (id: any) =>
  jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1h'
  });

// 產生 Token 並回傳
const generatorTokenAndSend = (user: any, res: any) => {
  const token = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  user.password = undefined;

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
  // 單獨的密鑰用於簽署 refresh token
  const refreshTokenSecret = REFRESH_TOKEN_SECRET ?? '';

  // refresh token 在一段時間後過期
  const refreshTokenExpiresIn = REFRESH_TOKEN_EXPIRES_IN ?? '7'; // 7 天

  // 生成 refresh token
  const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn
  });

  return refreshToken;
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

  const currentUser = await AuthModel.findById(decoded.id);

  if (!currentUser) return res.status(401).json({ message: '帳號未登入，請先登入' });
  req.user = currentUser;
};

export { signAccessToken, generatorTokenAndSend, isAuth };
