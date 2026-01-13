import { Pool } from 'pg';
import { GoalRepository } from '../interfaces/GoalRepository';
import { Goal, GoalView } from '../models/Goal';

export default class PostgreGoalRepository implements GoalRepository {
  public constructor(private readonly db: Pool) {}

  async getAll() {
    const result = await this.db.query<Goal>('SELECT * FROM goals');
    return result.rows;
  }

  async getById(id: number) {
    const result = await this.db.query<Goal>(
      'SELECT * FROM goals WHERE id = $1',
      [id],
    );

    return result.rowCount ? result.rows[0] : null;
  }

  async create(goal: GoalView) {
    const { title } = goal;

    const result = await this.db.query<Goal>(
      'INSERT INTO goals (title) VALUES($1) RETURNING *',
      [title],
    );

    return result.rows[0];
  }

  async update(goal: Goal) {
    const { id, title } = goal;

    const result = await this.db.query<Goal>(
      'UPDATE goals SET title = $2 WHERE id = $1 RETURNING *',
      [id, title],
    );

    return result.rows[0];
  }

  async delete(id: number) {
    const result = await this.db.query<Goal>(
      'DELETE FROM goals WHERE id = $1 RETURNING *',
      [id],
    );

    return result.rows[0];
  }
}
