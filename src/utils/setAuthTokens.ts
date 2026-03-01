import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';

export default function setAuthTokens(user: User, res: Response) {
  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
