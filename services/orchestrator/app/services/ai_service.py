from .speech_service import speech_service
from .interpretation_service import interpretation_service
from ..core.dynamic_config import dynamic_config
from ..core.config import settings
import asyncio
import httpx
import json

SYSTEM_PROMPT = """You are "Lifestyle Machine" (ម៉ាស៊ីនជីវិត), a friendly Cambodian lifestyle advisor.
You speak warmly in Khmer. Your responses are:
- 2-4 sentences max — concise, personal, positive
- Based on the insights provided, NOT invented facts
- Ending with a daily tip and 🙏
"""

class AIService:
    @staticmethod
    async def _call_gemini_vision(image_url: str, prompt: str) -> dict:
        """
        Analyzes image (palm/face) via Gemini 1.5 Flash Vision.
        Returns extracted features for interpretation.
        """
        api_key = dynamic_config.get('gemini_api_key') or dynamic_config.get('GEMINI_API_KEY')
        if not api_key: return None
        
        # Simplified Vision prompt based on existing rules
        is_palm = "palm" in prompt.lower()
        tool_prompt = "Extract palm features: heart_line (long_straight, curved, short), head_line, life_line." if is_palm else \
                      "Extract face features: face_shape (oval, square, round), eyes (large, narrow)."

        payload = {
            "contents": [{
                "parts": [
                    {"text": f"{tool_prompt} return only json. No explanation."},
                    {"inlineData": {"mimeType": "image/jpeg", "data": await AIService._get_image_base64(image_url)}}
                ]
            }]
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, json=payload)
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"].replace('```json', '').replace('```', '').strip()
                return json.loads(text)
        except Exception as e:
            print(f"[VisionService] Error: {e}")
            return None

    @staticmethod
    async def _get_image_base64(url: str) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            import base64
            return base64.b64encode(resp.content).decode("utf-8")

    @staticmethod
    async def _call_gemini_chat(prompt: str, insights: list) -> str:
        api_key = dynamic_config.get('gemini_api_key') or dynamic_config.get('GEMINI_API_KEY')
        if not api_key: return None

        user_message = f"{prompt}\n\nInsights: {'. '.join(insights)}"
        payload = {
            "contents": [{"parts": [{"text": SYSTEM_PROMPT}, {"text": user_message}]}],
            "generationConfig": {"temperature": 0.8, "maxOutputTokens": 256}
        }
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                return resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        except: return None

    # Daily Cache for common queries (Horoscope)
    # Key: "date:intent:sign", Value: response_text
    _daily_cache = {}

    @staticmethod
    def _get_cache_key(intent: str, transcript: str) -> str:
        from datetime import date
        # Simple sign detection or just generic today
        sign = "generic"
        lower_msg = (transcript or "").lower()
        signs = ["rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"]
        for s in signs:
            if s in lower_msg: sign = s
        return f"{date.today()}:{intent}:{sign}"

    @staticmethod
    async def process_lifestyle_query(platform_id: str, platform: str, user_id: str = None, text: str = None, voice_url: str = None, image_url: str = None):
        """
        Operational Standard Orchestration:
        Vision/STT -> Rule Engine -> Synthesis -> TTS
        """
        # 1. Input Processing (Transcription)
        transcript = text
        if voice_url:
            transcript = await speech_service.transcribe_khmer(voice_url)

        # 2. Intent Detection
        msg = (transcript or "").lower()
        if "palm" in msg or "ដៃ" in msg or (image_url and "palm" in msg): intent = "PALM"
        elif "face" in msg or "មុខ" in msg or (image_url and "face" in msg): intent = "FACE"
        elif "love" in msg or "ស្នេហ" in msg: intent = "LOVE"
        elif "horoscope" in msg or "ជោគជតា" in msg: intent = "HOROSCOPE"
        else: intent = "GENERAL"

        # 3. Cache Check (Daily Horoscope Only)
        cache_key = AIService._get_cache_key(intent, msg)
        if intent == "HOROSCOPE" and cache_key in AIService._daily_cache:
            print(f"[AIService] Cache Hit for {cache_key}")
            response_text = AIService._daily_cache[cache_key]
        else:
            # 4. AI Tool Processing (Rules-driven)
            insights = []
            if image_url and intent in ["PALM", "FACE"]:
                features = await AIService._call_gemini_vision(image_url, intent)
                if features:
                    insights = interpretation_service.interpret_palm(features) if intent == "PALM" else interpretation_service.interpret_face(features)
            
            if intent == "LOVE":
                insights = interpretation_service.interpret_love({"user": "មេត្រី", "partner": "សុវណ្ណ"})

            # Fallback if no vision/rules triggered
            if not insights:
                fallback = {
                    "PALM": ["ស្នាមដៃរបស់អ្នកបង្ហាញពីទេពកោសល្យខ្ពស់។"],
                    "FACE": ["មុខមាត់របស់អ្នកបង្ហាញថាអ្នកជាមនុស្សមានសេរីភាព។"],
                    "HOROSCOPE": ["ថ្ងៃនេះជាថ្ងៃល្អសម្រាប់ការចាប់ផ្តើមថ្មី។"],
                    "LOVE": ["ទំនាក់ទំនងរបស់អ្នកមានសញ្ញាល្អច្រើន។"],
                    "GENERAL": ["សួរខ្ញុំអំពីជោគជតា ស្នាមដៃ ឬស្នេហា!"]
                }
                insights = fallback.get(intent, fallback["GENERAL"])

            # 5. Response Synthesis
            response_text = await AIService._call_gemini_chat(f"User asked about {intent}.", insights)
            if not response_text:
                response_text = f"ជម្រាបសួរ! {' '.join(insights)} សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏"

            # Populate Daily Cache
            if intent == "HOROSCOPE":
                AIService._daily_cache[cache_key] = response_text

        # 6. TTS Output
        audio_url = await speech_service.synthesize_khmer(response_text)

        # 7. Operational Return (Standard for Business Dashboard)
        return {
            "user_id": user_id,
            "intent": intent,
            "transcript": transcript,
            "response_text": response_text,
            "audio_url": audio_url,
            "ai_cost": settings.AI_COST_TARGET,
            "estimated_margin": 0.82, # 82% margin per request
            "platform": platform
        }

ai_service = AIService()
