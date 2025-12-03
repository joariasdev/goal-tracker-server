import config from './config/config';
import express, { Request, Response } from 'express';
import db from './config/db';
import CreateGoalRequestBody from './models/CreateGoalRequestBody';
import Goal from './models/Goal';

const app = express();

app.disable('x-powered-by');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post(
  '/goals',
  async (req: Request<any, any, CreateGoalRequestBody>, res: Response) => {
    const { title } = req.body;

    const result = await db.query<Goal>(
      'INSERT INTO goals (title) VALUES($1) RETURNING *',
      [title],
    );
    res.status(201).send(result.rows);
  },
);

app.listen(config.port, () =>
  console.log(`Server is running on port: ${config.port}`),
);
