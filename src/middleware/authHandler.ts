import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import passport from 'passport';

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
        return res.status(401).json({
          success: false,
          message: info.message ?? 'Unauthorized',
        });
      }

      req.user = user;

      next();
    },
  )(req, res, next);
}
