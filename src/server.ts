import config from './config/config';
import express, { Request, Response } from 'express';
import db from './config/db';
import type { Goal, GoalView } from './models/Goal';
import cors from 'cors';

const app = express();

app.disable('x-powered-by');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/goals', async (req: Request, res: Response) => {
  const result = await db.query<Goal>('SELECT * FROM goals');
  res.status(200).send(result.rows);
});

app.get('/goals/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db.query<Goal>('SELECT * FROM goals WHERE id = $1', [
    id,
  ]);
  res.status(200).send(result.rows);
});

app.post('/goals', async (req: Request<any, any, GoalView>, res: Response) => {
  const { title }: GoalView = req.body;

  const result = await db.query<Goal>(
    'INSERT INTO goals (title) VALUES($1) RETURNING *',
    [title],
  );
  res.status(201).send(result.rows[0]);
});

app.listen(config.port, () =>
  console.log(`Server is running on port: ${config.port}`),
);
