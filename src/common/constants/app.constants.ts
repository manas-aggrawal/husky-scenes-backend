import * as dotenv from 'dotenv';
dotenv.config();

export const {
  DB_URL,
  SALT_ROUNDS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONT_END_BASE_URL,
  STAGE,
} = process.env;
