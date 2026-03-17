from .speech_service import speech_service
from .interpretation_service import interpretation_service
from ..core.dynamic_config import dynamic_config
import asyncio
import httpx
import json

# Khmer system prompt for the lifestyle AI persona
SYSTEM_PROMPT = """You are "Lifestyle Machine" (ម៉ាស៊ីនជីវិត), a friendly Cambodian lifestyle and fortune advisor.
You speak warmly and naturally in Khmer (Cambodian language). 
Your responses are:
- 2-4 sentences max — concise, personal, positive
- Based on the lifestyle insight provided, NOT invented facts
- Written entirely in Khmer script
- Encouraging and uplifting in tone
- Ending with an actionable tip for the day
If you receive structured insights, weave them naturally into your response.
Always end with: "សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏"
"""

class AIService:
    @staticmethod
    async def _call_gemini(prompt: str, insights: list) -> str:
        """
        Calls Gemini Flash 1.5 to generate a personalised Khmer lifestyle response.
        Returns None if API key is not configured.
        """
        api_key = dynamic_config.get('gemini_api_key') or dynamic_config.get('GEMINI_API_KEY')
        if not api_key:
            print("[AIService] No Gemini API key configured — using rule-based fallback.")
            return None

        # Build the user message, injecting any rule-based insights
        user_message = prompt
        if insights:
            user_message += f"\n\nInsights from lifestyle analysis: {'. '.join(insights)}"

        payload = {
            "contents": [{
                "parts": [
                    {"text": SYSTEM_PROMPT},
                    {"text": user_message}
                ]
            }],
            "generationConfig": {
                "temperature": 0.8,
                "maxOutputTokens": 256,
                "topP": 0.9
            }
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"[AIService] Gemini responded ({len(text)} chars)")
                return text.strip()
        except Exception as e:
            print(f"[AIService] Gemini call failed: {e}")
            return None

    @staticmethod
    async def process_lifestyle_query(platform_id: str, platform: str, text: str = None, voice_url: str = None):
        """
        Main orchestration flow:
        STT -> Intent Classification -> Rule Mapping -> Gemini Synthesis -> TTS
        """
        # 1. Voice to Text (if voice message)
        transcript = text
        if voice_url:
            transcript = await speech_service.transcribe_khmer(voice_url)

        # 2. Intent Classification
        msg = (transcript or "").lower()
        if "palm" in msg or "ដៃ" in msg:
            intent = "PALM"
        elif "face" in msg or "មុខ" in msg:
            intent = "FACE"
        elif "horoscope" in msg or "ជោគជតា" in msg or "ដំណើរ" in msg:
            intent = "HOROSCOPE"
        else:
            intent = "GENERAL"

        # 3. Rule-based structured insights
        structured_insights = []
        if intent == "PALM":
            mock_features = {"heart_line": "long_straight", "head_line": "curved"}
            structured_insights = interpretation_service.interpret_palm(mock_features)
        elif intent == "FACE":
            mock_attributes = {"face_shape": "oval", "eyes": "large"}
            structured_insights = interpretation_service.interpret_face(mock_attributes)

        # 4. Build Gemini prompt based on intent
        intent_prompts = {
            "PALM":       f"The user asked about their palm reading. Provide a warm lifestyle insight.",
            "FACE":       f"The user asked about their face reading. Provide a warm personality insight.",
            "HOROSCOPE":  f"The user asked about their horoscope and fortune today. Provide an uplifting daily forecast.",
            "GENERAL":    f"The user said: '{transcript}'. Provide a warm, helpful lifestyle response."
        }
        gemini_prompt = intent_prompts.get(intent, intent_prompts["GENERAL"])

        # 5. Call Gemini (with rule-based fallback)
        response_text = await AIService._call_gemini(gemini_prompt, structured_insights)

        if not response_text:
            # Fallback: compose response from rules + default message
            if structured_insights:
                response_text = f"ជម្រាបសួរ! ផ្អែកលើការវិភាគ{intent}របស់អ្នក: {' '.join(structured_insights)} សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏"
            else:
                fallback_map = {
                    "PALM":      "ស្នាមដៃរបស់អ្នកបង្ហាញពីចរិតស្ងប់ស្ងាត់ ព្រមទាំងទេពកោសល្យខ្លាំង។ ថ្ងៃនេះសូមប្រើប្រាស់ភាពឆ្លាតវៃរបស់អ្នក! សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏",
                    "FACE":      "មុខរបស់អ្នកបង្ហាញពីបុគ្គលម្នាក់ដែលមានចិត្ដគំនិតច្រើន និងសប្បុរស។ ថ្ងៃនេះជំនួយដល់អ្នកដទៃនឹងនាំមកសំណាងល្អ! សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏",
                    "HOROSCOPE": "ថ្ងៃនេះអ្នកមានថាមពលវិជ្ជមាន និងឱកាសល្អកំពុងរង់ចាំ។ សូមទុកចិត្ដលើអារម្មណ៍ខ្ពស់របស់អ្នក! សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏",
                    "GENERAL":   "ជម្រាបសួរ! ខ្ញុំជាម៉ាស៊ីនជីវិតរបស់អ្នក។ សួរខ្ញុំអំពីជោគជតា ស្នាមដៃ ឬការព្យាករណ៍ប្រចាំថ្ងៃ! សូមប្រយ័ត្ន និងមានសុភមង្គល! 🙏"
                }
                response_text = fallback_map.get(intent, fallback_map["GENERAL"])

        # 6. Text to Speech
        audio_url = await speech_service.synthesize_khmer(response_text)

        return {
            "transcript":   transcript,
            "response_text": response_text,
            "audio_url":    audio_url,
            "intent":       intent,
            "disclaimer":   "For entertainment and lifestyle insight only."
        }

ai_service = AIService()
