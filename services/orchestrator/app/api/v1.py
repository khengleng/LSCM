from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.ai_service import ai_service

router = APIRouter()

class QueryRequest(BaseModel):
    platform: str
    platformId: str
    userId: Optional[str] = None
    text: Optional[str] = None
    voice_url: Optional[str] = None
    image_url: Optional[str] = None

@router.post("/query")
async def process_query(request: QueryRequest):
    """
    Main entry point for Gateway requests. 
    Enforces business plan logic via ai_service.
    """
    try:
        result = await ai_service.process_lifestyle_query(
            platform_id=request.platformId,
            user_id=request.userId,
            platform=request.platform,
            text=request.text,
            voice_url=request.voice_url,
            image_url=request.image_url
        )
        return result
    except Exception as e:
        print(f"[Orchestrator] CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="Lifestyle Engine is currently optimizing. Please try again later.")
