import { Router } from 'express';
import db from '../config/db';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import HttpError from '../errors/HttpError';
import { env } from '../config/env';

const router = Router();

router.post('/login', async (req, res, next) => {  
  try {
    const { email, password } = req.body;
    const queryResult = await db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    const user: User = queryResult.rows[0];

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

    const queryResult = await db.query<User>(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
      [email, hashedPassword],
    );

    const user = queryResult.rows[0];

    if (!user) throw new HttpError('User creation failed.', 500);

    res
      .status(200)
      .json({ succes: true, message: 'Account created successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
