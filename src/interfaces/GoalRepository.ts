import { Goal, GoalView } from '../models/Goal';

export interface GoalRepository {
  getAll: () => Promise<Goal[]>;
  getById: (id: number) => Promise<Goal | null>;
  create: (goal: GoalView) => Promise<Goal>;
  update: (goal: Goal) => Promise<Goal>;
  delete: (id: number) => Promise<Goal>;
}
