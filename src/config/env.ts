import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.string().transform(Number),
  JWT_SECRET: z.string().min(10, 'Secret must be at least 10 characters long'),
  SALT_ROUNDS: z.string().transform(Number),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', z.treeifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;
