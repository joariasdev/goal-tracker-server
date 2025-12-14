import db from '../config/db';
import { Goal, GoalView } from '../models/Goal';
import { Request, Response } from 'express';

class goalController {
  static getAll = async (req: Request, res: Response) => {
    const result = await db.query<Goal>('SELECT * FROM goals');
    res.status(200).send(result.rows);
  };

  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await db.query<Goal>('SELECT * FROM goals WHERE id = $1', [
      id,
    ]);
    res.status(200).send(result.rows[0]);
  };

  static create = async (req: Request<any, any, GoalView>, res: Response) => {
    const { title }: GoalView = req.body;

    const result = await db.query<Goal>(
      'INSERT INTO goals (title) VALUES($1) RETURNING *',
      [title],
    );
    res.status(201).send(result.rows[0]);
  };

  static update = async (req: Request<any, any, GoalView>, res: Response) => {
    const { id } = req.params;
    const { title }: GoalView = req.body;

    const result = await db.query<Goal>(
      'UPDATE goals SET title = $2 WHERE id = $1 RETURNING *',
      [id, title],
    );
    res.status(200).send(result.rows[0]);
  };

  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await db.query<Goal>(
      'DELETE FROM goals WHERE id = $1 RETURNING *',
      [id],
    );
    res.status(200).send(result.rows[0]);
  };
}

export default goalController;
