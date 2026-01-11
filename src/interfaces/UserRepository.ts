import { User } from '../models/User';

export interface UserRepository {
  create: (email: string, hashedPassword: string) => Promise<User>;
  findById: (id: number) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
}