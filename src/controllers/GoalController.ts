
import HttpError from '../errors/HttpError';
import { GoalRepository } from '../interfaces/GoalRepository';
import { GoalView } from '../models/Goal';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

class GoalController {
  public constructor(private readonly repo: GoalRepository) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const goals = await this.repo.getAll();
      res.status(200).send(goals);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const goal = await this.repo.getById(id);

      if (!goal) {
        throw new HttpError(`Goal with ID ${id} not found.`, 404);
      }

      res.status(200).send(goal);
    } catch (err) {
      next(err);
    }
  };

  create = [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and must be a non-empty string.')
      .escape(),

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
          res.status(400).send({ errors: validationErrors.array() });
          return;
        }

        const { title }: GoalView = req.body;

        const goal = await this.repo.create({ title });

        res.status(201).send(goal);
      } catch (err) {
        next(err);
      }
    },
  ];

  update = [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required and must be a non-empty string.')
      .escape(),

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
          res.status(400).send({ errors: validationErrors.array() });
          return;
        }

        const id = Number(req.params.id);
        const { title }: GoalView = req.body;

        const goal = await this.repo.update({ id, title });

        if (!goal) {
          throw new HttpError(`Goal with ID ${id} not found.`, 404);
        }

        res.status(200).send(goal);
      } catch (err) {
        next(err);
      }
    },
  ];

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const goal = await this.repo.delete(id);

      if (!goal) {
        throw new HttpError(`Goal with ID ${id} not found.`, 404);
      }

      res.status(200).send(goal);
    } catch (err) {
      next(err);
    }
  };
}

export default GoalController;
