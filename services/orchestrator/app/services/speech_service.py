from ..core.dynamic_config import dynamic_config
import httpx
import base64
import asyncio

class SpeechService:

    # ─────────────────────────────────────────────────────────────────
    # Speech-to-Text: Khmer audio -> transcript
    # Uses Google Cloud Speech-to-Text REST API v1
    # ─────────────────────────────────────────────────────────────────
    @staticmethod
    async def transcribe_khmer(audio_url: str) -> str:
        """
        Downloads audio from audio_url and transcribes it using
        Google Cloud Speech-to-Text with Khmer language model.
        Falls back to a default Khmer question if not configured.
        """
        if not audio_url:
            return ""

        api_key = dynamic_config.get('google_api_key') or dynamic_config.get('gemini_api_key')
        if not api_key:
            print("[SpeechService] No Google API key — returning mock transcript.")
            return "ថ្ងៃនេះខ្ញុំមានសំណាងទេ?"

        try:
            # 1. Download the audio file
            async with httpx.AsyncClient(timeout=15.0) as client:
                audio_resp = await client.get(audio_url)
                audio_resp.raise_for_status()
                audio_b64 = base64.b64encode(audio_resp.content).decode("utf-8")

            # 2. Submit to Google STT REST API
            stt_payload = {
                "config": {
                    "encoding":        "OGG_OPUS",   # Telegram voice messages are OGG/OPUS
                    "sampleRateHertz": 16000,
                    "languageCode":    "km-KH",       # Khmer
                    "alternativeLanguageCodes": ["en-US"],  # Fallback for mixed speech
                    "model":           "default",
                },
                "audio": {
                    "content": audio_b64
                }
            }

            stt_url = f"https://speech.googleapis.com/v1/speech:recognize?key={api_key}"

            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(stt_url, json=stt_payload)
                resp.raise_for_status()
                data = resp.json()

            results = data.get("results", [])
            if results:
                transcript = results[0]["alternatives"][0]["transcript"]
                print(f"[SpeechService] STT result: {transcript}")
                return transcript
            else:
                print("[SpeechService] STT returned no results — audio may be silent.")
                return ""

        except Exception as e:
            print(f"[SpeechService] STT error: {e}")
            return "ថ្ងៃនេះខ្ញុំមានសំណាងទេ?"  # Safe fallback

    # ─────────────────────────────────────────────────────────────────
    # Text-to-Speech: Khmer text -> audio URL
    # Uses Google Cloud Text-to-Speech REST API v1
    # ─────────────────────────────────────────────────────────────────
    @staticmethod
    async def synthesize_khmer(text: str) -> str:
        """
        Converts Khmer text into a spoken audio MP3.
        Returns a data URI (base64 MP3) that can be sent as a Telegram voice or
        Facebook audio attachment directly without needing an external CDN.
        Falls back to empty string if not configured.
        """
        if not text:
            return ""

        api_key = dynamic_config.get('google_api_key') or dynamic_config.get('gemini_api_key')
        if not api_key:
            print("[SpeechService] No Google API key — skipping TTS synthesis.")
            return ""  # No audio; gateway will send text-only reply

        tts_payload = {
            "input": {"text": text},
            "voice": {
                "languageCode": "km-KH",
                "ssmlGender":   "FEMALE",
                "name":         "km-KH-Wavenet-A"   # Best available Khmer female voice
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "speakingRate":  0.95,   # Slightly slower for clarity
                "pitch":         0.0
            }
        }

        tts_url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(tts_url, json=tts_payload)
                resp.raise_for_status()
                audio_b64 = resp.json().get("audioContent", "")

            if audio_b64:
                # Return as a data URI — can be sent inline to Telegram/Facebook
                data_uri = f"data:audio/mp3;base64,{audio_b64}"
                print(f"[SpeechService] TTS generated ({len(audio_b64)} chars b64)")
                return data_uri
            return ""

        except Exception as e:
            print(f"[SpeechService] TTS error: {e}")
            return ""  # Graceful — text reply still goes through

speech_service = SpeechService()
