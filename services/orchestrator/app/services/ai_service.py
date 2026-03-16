from .speech_service import speech_service
from .interpretation_service import interpretation_service
import asyncio

class AIService:
    @staticmethod
    async def process_lifestyle_query(platform_id: str, platform: str, text: str = None, voice_url: str = None):
        """
        Main orchestration flow:
        STT -> Intent Classification -> Rule Mapping -> LLM Synthesis -> TTS
        """
        # 1. Voice to Text if needed
        transcript = text
        if voice_url:
            transcript = await speech_service.transcribe_khmer(voice_url)

        # 2. Mock Intent Classification (Horoscope vs Reading)
        # In production, use an LLM or NLU classifier
        intent = "HOROSCOPE"
        if "palm" in (transcript or "").lower():
            intent = "PALM"
        elif "face" in (transcript or "").lower():
            intent = "FACE"

        # 3. Handle Feature-based Readings
        structured_insights = []
        if intent == "PALM":
            # Mock extracted features from Gemini/Vision
            mock_features = {"heart_line": "long_straight", "head_line": "curved"}
            structured_insights = interpretation_service.interpret_palm(mock_features)
        elif intent == "FACE":
            # Mock extracted features from Vision
            mock_attributes = {"face_shape": "oval", "eyes": "large"}
            structured_insights = interpretation_service.interpret_face(mock_attributes)

        # 4. Generate Final Response using Text Model
        # TODO: Call Gemini Flash or Llama to personalize the answer based on structured_insights
        response_text = f"ជម្រាបសួរ! [Lifestyle Analysis] ផ្អែកលើ {intent} របស់អ្នក: "
        if structured_insights:
            response_text += " ".join(structured_insights)
        else:
            response_text += "សម្រាប់ថ្ងៃនេះ អ្នកមានសំណាងល្អ និងមានថាមពលវិជ្ជមាន!"

        # 5. Text to Speech
        audio_url = await speech_service.synthesize_khmer(response_text)

        return {
            "transcript": transcript,
            "response_text": response_text,
            "audio_url": audio_url,
            "intent": intent,
            "disclaimer": "For entertainment and lifestyle insight only."
        }

ai_service = AIService()
