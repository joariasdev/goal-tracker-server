import NotFoundError from '../errors/NotFoundError';
import { GoalRepository } from '../interfaces/GoalRepository';
import { GoalView } from '../models/Goal';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import validateInput from '../utils/validateInput';
import { User } from '../models/User';

class GoalController {
  public constructor(private readonly repo: GoalRepository) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as User).id;
      const goals = await this.repo.getAll(userId);
      res.status(200).send(goals);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as User).id;
      const goalId = Number(req.params.id);
      const goal = await this.repo.getById(userId, goalId);

      if (!goal) {
        throw new NotFoundError(`Goal with ID ${goalId} not found.`);
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
        validateInput(req);

        const userId: number = (req.user as User).id;

        const goalProps: GoalView = req.body;

        const goal = await this.repo.create(userId, goalProps);

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
        validateInput(req);

        const userId = (req.user as User).id;
        const goalId = Number(req.params.id);
        const { title, description, isCompleted }: GoalView = req.body;

        const goal = await this.repo.update(userId, {
          id: goalId,
          title,
          description,
          isCompleted,
        });

        if (!goal) {
          throw new NotFoundError(`Goal with ID ${goalId} not found.`);
        }

        res.status(200).send(goal);
      } catch (err) {
        next(err);
      }
    },
  ];

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as User).id;
      const goalId = Number(req.params.id);
      const goal = await this.repo.delete(userId, goalId);

      if (!goal) {
        throw new NotFoundError(`Goal with ID ${goalId} not found.`);
      }

      res.status(200).send(goal);
    } catch (err) {
      next(err);
    }
  };
}

export default GoalController;
