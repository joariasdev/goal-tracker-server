import { Router } from 'express';
import db from '../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import HttpError from '../errors/HttpError';
import { env } from '../config/env';
import PostgreUserRepository from '../repositories/PostgreUserRepository';

const router = Router();
const userRepo = new PostgreUserRepository(db);

router.post('/login', async (req, res, next) => {  
  try {
    const { email, password } = req.body;

    const user = await userRepo.findByEmail(email);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({ success: true, token: `Bearer ${token}` });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);

    const user = userRepo.create(email, hashedPassword)

    if (!user) throw new HttpError('User creation failed.', 500);

    res
      .status(200)
      .json({ succes: true, message: 'Account created successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
