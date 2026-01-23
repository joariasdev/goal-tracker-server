import { Pool } from 'pg';
import { GoalRepository } from '../interfaces/GoalRepository';
import { Goal, GoalView } from '../models/Goal';

export default class PostgreGoalRepository implements GoalRepository {
  public constructor(private readonly db: Pool) {}

  async getAll(userId: number) {
    const result = await this.db.query<Goal>(
      'SELECT * FROM goals WHERE user_id = $1',
      [userId],
    );
    return result.rows;
  }

  async getById(userdId: number, goalId: number) {
    const result = await this.db.query<Goal>(
      'SELECT * FROM goals WHERE user_id = $1 AND id = $2',
      [userdId, goalId],
    );

    return result.rowCount ? result.rows[0] : null;
  }

  async create(userId: number, goal: GoalView) {
    const result = await this.db.query<Goal>(
      'INSERT INTO goals (user_id, title, description) VALUES($1, $2, $3) RETURNING *',
      [userId, goal.title, goal.description],
    );

    return result.rows[0];
  }

  async update(userId: number, goal: Goal) {
    const result = await this.db.query<Goal>(
      'UPDATE goals SET title = $3, description = $4, is_completed = $5 WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, goal.id, goal.title, goal.description, goal.isCompleted],
    );

    return result.rows[0];
  }

  async delete(userdId: number, id: number) {
    const result = await this.db.query<Goal>(
      'DELETE FROM goals WHERE user_id = $1 AND id = $2 RETURNING *',
      [userdId, id],
    );

    return result.rows[0];
  }
}
