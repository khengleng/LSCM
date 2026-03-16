from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.ai_service import ai_service

router = APIRouter()

class QueryRequest(BaseModel):
    platform: str
    platformId: str
    text: Optional[str] = None
    voice_url: Optional[str] = None

@router.post("/query")
async def process_query(request: QueryRequest):
    """
    Handles incoming request from the Gateway.
    """
    try:
        result = await ai_service.process_lifestyle_query(
            platform_id=request.platformId,
            platform=request.platform,
            text=request.text,
            voice_url=request.voice_url
        )
        return result
    except Exception as e:
        print(f"[Orchestrator] Error processing query: {e}")
        raise HTTPException(status_code=500, detail="Error generating lifestyle insight")
