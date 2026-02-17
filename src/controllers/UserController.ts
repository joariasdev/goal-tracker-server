import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../interfaces/UserRepository';
import AuthenticationError from '../errors/AuthenticationError';
import { body } from 'express-validator';
import validateInput from '../utils/validateInput';
import { UserView } from '../models/User';
import NotFoundError from '../errors/NotFoundError';

export default class UserController {
  public constructor(private readonly repo: UserRepository) {}

  login = [
    body('email').trim().escape(),
    body('password').trim().escape(),

    async (req: Request, res: Response, next: NextFunction) => {
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
            new AuthenticationError(
              "The password you've entered is incorrect.",
            ),
          );
        }

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

        return res.status(200).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } catch (error) {
        return next(error);
      }
    },
  ];

  register = [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email must be a valid email address.')
      .escape(),

    body('password')
      .trim()
      .isStrongPassword()
      .withMessage(
        'Password must be at least 8 characters long. It must contain at least one uppercase letter, one number and one symbol.',
      )
      .escape(),

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validateInput(req);

        const { email, password, firstName, lastName }: UserView = req.body;

        const existingUser = await this.repo.findByEmail(email);

        if (existingUser) {
          return next(
            new AuthenticationError(
              'The email you entered has alredy been used.',
            ),
          );
        }
        const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);

        const newUser = await this.repo.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });

        // Define correct error with 500 code
        if (!newUser)
          throw new AuthenticationError(
            'User creation failed. Please try again.',
          );

        res.status(200).json({ message: 'Account created successfully.' });
      } catch (error) {
        next(error);
      }
    },
  ];

  me = async (req: Request, res: Response) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new AuthenticationError('Invalid token');
    }

    const jwtPayload = jwt.verify(accessToken, env.JWT_SECRET) as JwtPayload;

    const user = await this.repo.findById(jwtPayload.id);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  };
}
