import config from './config/config';
import express, { Request, Response } from 'express';
import db from './config/db';

const app = express();

app.disable('x-powered-by');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/goals', async (req: Request, res: Response) => {
  const { title } = req.body;
  const result = await db.query(
    'INSERT INTO goals (title) VALUES($1) RETURNING *',
    [title],
  );
  res.status(201).send(result.rows);
});

app.listen(config.port, () =>
  console.log(`Server is running on port: ${config.port}`),
);
