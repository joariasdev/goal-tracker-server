import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../interfaces/UserRepository';
import AuthenticationError from '../errors/AuthenticationError';

export default class UserController {
  public constructor(private readonly repo: UserRepository) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await this.repo.findByEmail(email);

      if (!user) {
        return next(
          new AuthenticationError(
            "The email you entered isn't connected to an account.",
          ),
        );
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return next(
          new AuthenticationError("The password you've entered is incorrect."),
        );
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });

      return res.status(200).json({ token: `Bearer ${token}` });
    } catch (error) {
      return next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);

      const user = this.repo.create(email, hashedPassword);

      // Define correct error with 500 code
      if (!user)
        throw new AuthenticationError(
          'User creation failed. Please try again.',
        );

      res.status(200).json({ message: 'Account created successfully.' });
    } catch (error) {
      next(error);
    }
  };
}
