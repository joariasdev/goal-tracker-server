import { Pool } from 'pg';
import { User, UserDTO, UserView } from '../models/User';
import { UserRepository } from '../interfaces/UserRepository';

export default class PostgreUserRepository implements UserRepository {
  public constructor(private readonly db: Pool) {}

  async create(user: UserView): Promise<User> {
    const result = await this.db.query<User>(
      'INSERT INTO users(email, password_hash, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *',
      [user.email, user.password, user.firstName, user.lastName],
    );

    return result.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query<UserDTO>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    return result.rowCount ? this.mapUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query<UserDTO>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    return result.rowCount ? this.mapUser(result.rows[0]) : null;
  }

  mapUser(user: UserDTO) {
    const { id, email, password_hash, first_name, last_name } = user;

    const mappedUser: User = {
      id,
      email,
      password: password_hash,
      firstName: first_name,
      lastName: last_name,
    };

    return mappedUser;
  }
}
