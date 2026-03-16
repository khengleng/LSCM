import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Lifestyle Machine Orchestrator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # AI Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    ASTROVISOR_API_KEY: str = os.getenv("ASTROVISOR_API_KEY")

    # DB & Redis
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    REDIS_URL: str = os.getenv("REDIS_URL")

    # Paths
    RULES_PATH: str = os.getenv("RULES_PATH", "./rules")
    
    # Cost Management (Thresholds)
    AI_COST_TARGET: float = 0.008

settings = Settings()
