import { Pool } from 'pg';
import { User } from '../models/User';
import { UserRepository } from '../interfaces/UserRepository';

export default class PostgreUserRepository implements UserRepository {
  public constructor(private readonly db: Pool) {}

  async create(email: string, hashedPassword: string): Promise<User> {
    const result = await this.db.query<User>(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
      [email, hashedPassword],
    );

    return result.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    return result.rowCount ? result.rows[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    return result.rowCount ? result.rows[0] : null;
  }
}
