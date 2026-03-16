# prompt-3.md — Lifestyle Machine Voice-First Platform for Cambodia (with Face Reading)

You are building a production-ready, scalable, voice-first AI mini-app called **Lifestyle Machine** for the Cambodia market.

## Product Goal

Build a Khmer-friendly lifestyle AI platform that integrates into a banking mobile app such as Wing Bank.

Users should primarily interact by **voice**, not typing.

The system must let users:
- tap a microphone
- ask questions in Khmer
- optionally upload a palm image
- optionally upload a face image
- receive an answer in **Khmer voice and Khmer text** (Voice notes and text for Messenger/Telegram)
- top up credit or activate subscription via **Wing SDK** (In-App) or **KHQR Code** (Messenger/Telegram)

The platform must support:
- daily horoscope and lifestyle insights
- love compatibility analysis
- palm reading
- face reading
- premium reports
- subscriptions and one-time purchases

## Critical Market Requirement

Cambodian users often make typing errors and may prefer speaking. Therefore:
- the UX must be **voice-first**
- Khmer must be the default language
- responses must be short, friendly, and easy to listen to
- all major flows must support **voice input**
- all answers must support **voice output + text output**

## Important Provider Constraint

Do not assume AstroVisor can do face reading or palm reading.

Use AstroVisor only for:
- birth chart
- compatibility
- zodiac and date-based calculations

For face reading, the platform must use:
- a vision model or CV detector to extract image features
- an internal interpretation layer or rules engine to map those features into lifestyle meanings
- a text model to generate the final answer

## Pricing & Credit Model
- **Free tier:** 3 questions/day. 1 palm/face reading per week.
- **Credit-based Top-up:** $1 = 5 questions, $2 = 15 questions, $5 = 50 questions.
- **Premium Plan:** $3/month (includes 10 daily questions, 5 palm/face readings/week).
- **Premium Reports:** Palm ($2), Face/Love ($3), Yearly ($5).

### Top-up flow
1. User asks a question but has 0 credits.
2. Bot sends "Top-up options" with prices.
3. User selects a package.
4. Bot generates a KHQR (for Messenger/Telegram) or opens Wing SDK (for Mini-App).
5. After payment, bot adds credits to the user's account and notifies them.

## Architecture Requirements

Build the system with modular services.

```text
Wing Mobile App  |  FB Messenger  |  Telegram
    \               |               /
     \              v              /
      +---> Messaging Webhooks <---+
                    |
                    v
API Gateway / WAF / CDN
    |
Lifestyle Machine Backend
    |
    ├ Auth Service (WingID, FB PSID, Telegram ChatID)
    ├ User Profile Service
    ├ Quota and Subscription Service
    ├ Payment Service (Wing SDK + KHQR Generator)
    ├ Admin Service & Web Portal (Next.js/Dashboard)
    ├ Request Orchestrator
    ├ Prompt Builder
    ├ Safety Filter
    ├ Analytics Service
    |
    ├ Speech Layer (Transcribe Audio Notes / Generate Voice Notes)
    │    ├ Speech-to-Text (Khmer)
    │    └ Text-to-Speech (Khmer)
    |
    ├ Image Understanding Layer
    │    ├ Palm Feature Extraction
    │    └ Face Landmark / Attribute Detection
    |
    ├ Interpretation Layer
    │    ├ Astrology Rules
    │    ├ Palm Reading Rules
    │    └ Face Reading Rules
    |
    ├ Redis Cache
    ├ PostgreSQL Database
    ├ Object Storage
    |
    └ External AI Providers
         ├ AstroVisor
         ├ Vision Model
         ├ Face Detector
         ├ Text Model
         ├ STT Provider
         └ TTS Provider
```

## AI and Speech Stack

Use a low-cost but high-quality stack.

Recommended defaults:
- **Speech-to-Text:** Whisper for Khmer voice transcription
- **Astrology Engine:** AstroVisor
- **Vision Model:** Gemini Vision or equivalent multimodal model
- **Face Detection:** dedicated CV API, open model, or structured extraction pipeline
- **Text Insight Model:** Gemini Flash or Groq + Llama or lightweight OpenAI model
- **Text-to-Speech:** Google TTS or other Khmer-capable voice provider

## Product Requirements

### Voice Query Flow
1. user records Khmer voice query
2. backend transcribes the audio
3. system classifies intent
4. system checks credit balance / daily free quota
5. if balance > 0, deduct 1 credit and process request
6. if balance = 0, trigger top-up flow
7. system serves cached result or calls required AI services
8. system generates final Khmer text response
9. system converts response into Khmer speech
10. app receives:
    - transcript
    - text response
    - audio response URL or stream

### Palm Reading Flow
1. user uploads palm image
2. user may optionally describe or ask a question by voice
3. system validates consent and quota
4. vision layer extracts palm features
5. palm rules convert features into structured interpretation
6. text model produces a short Khmer explanation
7. TTS produces Khmer voice answer
8. app shows text and plays audio

### Face Reading Flow
1. user uploads face image
2. user may optionally ask by voice
3. system validates consent and quota
4. face detector extracts landmarks and visible attributes
5. face interpretation rules convert structure into reading themes
6. text model produces Khmer response
7. TTS produces Khmer voice answer
8. app shows text and plays audio

## Technical Requirements

### Backend & Deployment (Railway.app)
- build stateless API services in a **monorepo** structure.
- use **Railway Services** for individual modules.
- support horizontal scaling via Railway's autoscaling.
- use Railway Managed Redis for quota tracking and caching.
- use Railway Managed PostgreSQL for transactional and billing data.
- use cloud object storage (S3/GCS) for temporary palm and face images.

### Security
- secure all APIs
- use token-based authentication
- encrypt data in transit and at rest
- minimize retention of audio and image files
- keep Lifestyle Machine separate from core banking systems
- use API-only integration into the bank app

### Safety
- all outputs must be entertainment/lifestyle only
- do not provide financial, medical, or legal advice
- do not make deterministic predictions
- do not infer sensitive traits from face images
- all generated content must pass through a safety filter before TTS

### Cost Optimization
- free users should mostly get cached responses
- keep responses short for voice playback
- cache reusable text results
- optionally cache reusable daily TTS audio
- use low-cost model routing by default
- reserve expensive flows for premium users and paid reports
- cap face analysis frequency for free users

## Deliverables to Generate

Generate a full implementation starter with:
1. service architecture
2. backend API design
3. database schema
4. quota system design
5. payment and subscription handling
6. AI orchestration logic
7. speech pipeline design
8. palm upload processing flow
9. face reading processing flow
10. **Messenger/Telegram Webhook Integration**
11. **KHQR Credit Top-up and Subscription Polling Logic**
12. safety filtering logic
13. **Admin Web Portal (Next.js):**
    - Configuration UI (Limits, pricing)
    - Traffic Performance Monitoring
    - Payment/Revenue Ledger
14. **Business-Centric Observability Portfolio:**
    - Revenue tracking (Top-ups, Subs, Reports)
    - Credit consumption velocity monitoring
    - Omni-channel conversion (Wing vs. Messenger vs. Telegram)
    - Gross margin tracking per AI interpretation type
14. **Railway.app Infrastructure Configuration:**
    - `railway.json` or individual service Dockerfiles
    - Environment variable schema
    - Database migration strategy
15. deployment plan
16. profit-aware cost control strategy

## Expected Output Quality

The generated system should feel like:
- a fintech-grade platform
- voice-first for Cambodia
- production-minded
- scalable
- cost-aware
- easy for a mobile team and backend team to implement

## UX Principle

Design the app so the user experience feels like:
- “tap and talk”
- “hear the answer immediately”
- “read the same answer on screen”

The product should behave more like a **Khmer voice lifestyle assistant** than a text chatbot.

## Build Philosophy

Do not hand-wave the image features.

The AI tool must explicitly:
- extract image features
- structure them
- run them through interpretation logic
- then generate final voice-friendly output

Build the system so it can actually do the job instead of relying on vague magical prompts.
