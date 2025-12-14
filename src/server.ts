import config from './config/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/apiRouter';
import logger from 'morgan';

const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(config.port, () =>
  console.log(`Server is running on port: ${config.port}`),
);
