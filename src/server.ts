import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter';
import logger from 'morgan';
import errorHandler from './middleware/errorHandler';
import authRouter from './routes/authRouter';
import passport from 'passport';
import configPassport from './config/passport';
import isAuthorized from './middleware/authHandler';
import cookieParser from 'cookie-parser';

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

configPassport(passport);
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/api', isAuthorized, apiRouter);

app.use(errorHandler);

app.listen(env.PORT, () =>
  console.log(`Server is running on port: ${env.PORT}`),
);
