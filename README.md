# Lifestyle Machine

A voice-first AI lifestyle assistant for the Cambodia market.

## Architecture
- **Gateway (Node.js/TypeScript):** Handles Auth, Webhooks (FB/Telegram), and routing.
- **Orchestrator (Python/FastAPI):** Controls AI flows (STT, LLM, TTS) and interpretation logic.
- **Shared Rules:** JSON-based interpretation mapping for Palm and Face readings.

## Quick Start (Local)
1. Copy `.env.example` to `.env` in `services/gateway` and `services/orchestrator`.
2. Run `docker-compose up`.

## Deployment (Railway.app)
1. Create a new project on Railway.
2. Link this GitHub repository.
3. Railway will detect the monorepo. Add two separate services:
   - **Gateway:** Set Root Directory to `/` and Start Command to `npm start -w gateway`.
   - **Orchestrator:** Set Root Directory to `/` and Start Command to `uvicorn main:app --host 0.0.0.0 --port 8000`.
4. Provision Managed Postgres and Redis in the same project.
5. Add required AI API Keys to Environment Variables.

## Core Features
- Voice-first Khmer interaction (Whisper/Google TTS).
- Daily Horoscope & Compatibility.
- Palm & Face Reading (Vision-based extraction + Rule-specific interpretation).
- Credit-based top-ups (KHQR Generation).
