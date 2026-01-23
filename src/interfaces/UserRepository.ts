import { User, UserView } from '../models/User';

export interface UserRepository {
  create: (user: UserView) => Promise<User>;
  findById: (id: number) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
}
