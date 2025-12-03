import config from './config/config';
import express from 'express';
import db from './config/db';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(config.port, () =>
  console.log(`Server is running on port: ${config.port}`),
);
