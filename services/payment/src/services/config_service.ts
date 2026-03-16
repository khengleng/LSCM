import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

/**
 * Service to manage dynamic system configurations for the Payment Service.
 */
export class ConfigService {
  /**
   * Retrieves a configuration value by key.
   */
  static async get(key: string, defaultValue?: string): Promise<string | undefined> {
    // 1. Check Env Var first
    const envVal = process.env[key.toUpperCase()];
    if (envVal) return envVal;

    // 2. Check Database
    try {
      const res = await query('SELECT value FROM system_configs WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
    } catch (err) {
      console.error(`[Payment-Config] Error fetching key ${key}:`, err);
    }

    return defaultValue;
  }
}
