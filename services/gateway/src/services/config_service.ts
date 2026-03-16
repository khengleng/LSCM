import { query } from './db_service';

/**
 * Service to manage dynamic system configurations.
 * Prioritizes Environment Variables but falls back to Database for runtime updates.
 */
export class ConfigService {
  private static configCache: Map<string, string> = new Map();

  /**
   * Retrieves a configuration value by key.
   */
  static async get(key: string, defaultValue?: string): Promise<string | undefined> {
    // 1. Check Env Var first
    const envVal = process.env[key.toUpperCase()];
    if (envVal) return envVal;

    // 2. Check Cache
    if (this.configCache.has(key)) return this.configCache.get(key);

    // 3. Check Database
    try {
      const res = await query('SELECT value FROM system_configs WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        const val = res.rows[0].value;
        this.configCache.set(key, val);
        return val;
      }
    } catch (err) {
      console.error(`[Config-Service] Error fetching key ${key}:`, err);
    }

    return defaultValue;
  }

  /**
   * Updates a configuration value in the database and clears the cache.
   */
  static async set(key: string, value: string, category: string = 'api_keys'): Promise<void> {
    await query(
      `INSERT INTO system_configs (key, value, category, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [key, value, category]
    );
    this.configCache.delete(key);
  }

  /**
   * Warm up the cache with all database configs.
   */
  static async warmup(): Promise<void> {
    try {
      const res = await query('SELECT key, value FROM system_configs');
      res.rows.forEach(row => this.configCache.set(row.key, row.value));
      console.log(`[Config-Service] Cache warmed up with ${res.rows.length} keys.`);
    } catch (err) {
      console.error('[Config-Service] Warmup failed:', err);
    }
  }
}
