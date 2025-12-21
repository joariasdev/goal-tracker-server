import db from '../config/db';
import HttpError from '../errors/HttpError';
import { Goal, GoalView } from '../models/Goal';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

class goalController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db.query<Goal>('SELECT * FROM goals');
      res.status(200).send(result.rows);
    } catch (err) {
      next(err);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await db.query<Goal>('SELECT * FROM goals WHERE id = $1', [
        id,
      ]);

      if (result.rowCount === 0) {
        throw new HttpError(`Goal with ID ${id} not found.`, 404);
      }

      res.status(200).send(result.rows[0]);
    } catch (err) {
      next(err);
    }
  };

  static create = [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and must be a non-empty string.')
      .escape(),

    async (
      req: Request<any, any, GoalView>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
          res.status(400).send({ errors: validationErrors.array() });
          return;
        }

        const { title }: GoalView = req.body;

        const result = await db.query<Goal>(
          'INSERT INTO goals (title) VALUES($1) RETURNING *',
          [title],
        );

        res.status(201).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    },
  ];

  static update = [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and must be a non-empty string.')
      .escape(),

    async (
      req: Request<any, any, GoalView>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
          res.status(400).send({ errors: validationErrors.array() });
          return;
        }

        const { id } = req.params;
        const { title }: GoalView = req.body;

        const result = await db.query<Goal>(
          'UPDATE goals SET title = $2 WHERE id = $1 RETURNING *',
          [id, title],
        );

        if (result.rowCount === 0) {
          throw new HttpError(`Goal with ID ${id} not found.`, 404);
        }

        res.status(200).send(result.rows[0]);
      } catch (err) {
        next(err);
      }
    },
  ];

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await db.query<Goal>(
        'DELETE FROM goals WHERE id = $1 RETURNING *',
        [id],
      );

      if (result.rowCount === 0) {
        throw new HttpError(`Goal with ID ${id} not found.`, 404);
      }

      res.status(200).send(result.rows[0]);
    } catch (err) {
      next(err);
    }
  };
}

export default goalController;
