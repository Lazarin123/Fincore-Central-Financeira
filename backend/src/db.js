import 'dotenv/config';
import pg from 'pg';
pg.types.setTypeParser(1082, v => v);      // DATE -> 'YYYY-MM-DD'
pg.types.setTypeParser(1700, parseFloat);  // NUMERIC -> number
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export const q = (text, params) => pool.query(text, params).then(r => r.rows);
