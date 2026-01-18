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

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configPassport(passport);
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/api', isAuthorized, apiRouter);

app.use(errorHandler);

app.listen(env.PORT, () =>
  console.log(`Server is running on port: ${env.PORT}`),
);
