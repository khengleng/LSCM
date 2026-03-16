import os
from .config import settings
import psycopg2
from psycopg2.extras import RealDictCursor

class DynamicConfig:
    def __init__(self):
        self._cache = {}

    def get_db_connection(self):
        return psycopg2.connect(settings.DATABASE_URL, cursor_factory=RealDictCursor)

    def get(self, key: str, default: str = None) -> str:
        # 1. Environment Variable check
        env_val = os.getenv(key.upper())
        if env_val:
            return env_val

        # 2. Local cache check
        if key in self._cache:
            return self._cache[key]

        # 3. Database check
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT value FROM system_configs WHERE key = %s", (key,))
                    row = cur.fetchone()
                    if row:
                        val = row['value']
                        self._cache[key] = val
                        return val
        except Exception as e:
            print(f"[DynamicConfig] Error fetching {key}: {e}")

        return default

    def refresh_cache(self):
        self._cache = {}

dynamic_config = DynamicConfig()
