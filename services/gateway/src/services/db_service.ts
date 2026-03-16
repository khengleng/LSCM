import { Pool } from 'pg';

/**
 * Shared database pool for the Gateway service.
 * In a production microservice, this would be highly optimized.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
