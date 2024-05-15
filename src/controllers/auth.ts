import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { generatorTokenAndSend } from '../services/handleAuth';

export const authController = {
  async authLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ message: '用戶不存在' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '用戶名稱或密碼不正確' });
    }

    generatorTokenAndSend(user, res);
  },

  async generateAccessToken(req: Request) {
    console.log(req);
  }
};
