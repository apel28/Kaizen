import {Pool} from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    };

const pool = new Pool(config);

export default pool;

