import { Goal, GoalView } from '../models/Goal';

export interface GoalRepository {
  getAll: (userId: number) => Promise<Goal[]>;
  getById: (userdId: number, goalId: number) => Promise<Goal | null>;
  create: (userId: number, goal: GoalView) => Promise<Goal>;
  update: (userId: number, goal: Goal) => Promise<Goal>;
  delete: (userId: number, goalId: number) => Promise<Goal>;
}
