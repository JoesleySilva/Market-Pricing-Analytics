import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({  path: new URL('../../.env', import.meta.url)});

const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: `-c search_path=${process.env.DB_SCHEMA}`
});

console.log('DB CONFIG:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});