import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import passport from 'passport';
import AuthenticationError from '../errors/AuthenticationError';

export default async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: User, info: { message: string }) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        next(new AuthenticationError(info.message ?? 'Unauthorized'));
      }

      req.user = user;

      next();
    },
  )(req, res, next);
}
