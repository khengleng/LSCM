# Lifestyle Machine – Voice-First Technical System Design (Cambodia Market, with Face Reading)

## 1. Purpose

Lifestyle Machine is a voice-first AI lifestyle engagement mini-app designed for the Cambodia market and intended to integrate into a banking application such as Wing Bank.

The platform is optimized for users who prefer speaking over typing. Users can ask questions in Khmer by voice, and the system responds with both:
- Khmer voice output
- Khmer text output

The platform provides:
- horoscope and daily insights
- love compatibility analysis
- palm reading from uploaded images
- face reading from uploaded images
- premium reports
- voice-first conversational interaction
- omni-channel support (Facebook Messenger, Telegram, and Wing Mini-App)
- KHQR payment generation for external messaging platforms

## 2. Market Design Assumption

Because many Cambodian users are more comfortable speaking than typing, the product must be designed as:
- voice-first
- Khmer-friendly
- short-answer oriented
- tolerant of speech variation
- usable with low-friction interaction patterns

Core UX:
1. user taps microphone
2. user speaks in Khmer
3. system converts speech to text
4. AI processes request
5. system returns voice + text response

## 3. Product Scope

### Free tier
- 3 questions per day
- mostly cached daily insights
- 1 palm reading per week
- 1 face reading per week
- voice input supported
- voice + text response supported

### Pricing & Credit Model
- **Free tier:** 3 daily questions, 1 palm/face reading per week.
- **Credit Packages (Top-up):**
    - Starter: $1 for 5 Questions
    - Basic: $2 for 15 Questions
    - Pro: $5 for 50 Questions
- **Premium Plan:** $3/month (10 daily questions, 5 palm/face readings per week).

### Payment Methods
- **Wing SDK:** Seamless for In-App Mini-App users (Direct Subscription/Purchase/Top-up).
- **KHQR (QR Code):** Dynamic QR generated for Messenger and Telegram users to top up question credits or activate subscriptions via any Bakong-supported banking app.

## 4. Business Constraints

- the platform must stay profitable after AI, hosting, speech, and payment costs
- free users must mostly use cached or low-cost flows
- high-cost voice and AI generation must be controlled by quotas and caching
- the architecture must scale to large numbers of mobile users
- the mini-app must remain separate from core banking systems and use API-only integration
- astrology provider is not assumed to provide face reading directly

## 5. High-Level Architecture

```text
Wing Mobile App  |  FB Messenger  |  Telegram
    \               |               /
     \              v              /
      +---> Messaging Hub / Webhooks <---+
                    |
                    v
API Gateway / WAF / CDN
    |
    v
Lifestyle Machine Backend
    |
    +-- Auth Service (WingID / FB PSID / TelegramID)
    +-- User Profile Service
    +-- Quota and Subscription Service
    +-- Payment Service (Wing SDK + KHQR Generator)
    +-- Admin Service (Dashboard & Config)
    +-- Request Orchestrator
    +-- Prompt Builder
    +-- Safety Filter
    +-- Analytics Service
    |
    +-- Speech Layer (Supports Audio Messages & Text)
    |    +-- Speech-to-Text (Khmer)
    |    +-- Text-to-Speech (Khmer)
    |
    +-- Image Understanding Layer
    |    +-- Palm Feature Extraction
    |    +-- Face Landmark / Attribute Detection
    |
    +-- Admin Web Portal (Next.js/React)
    |    +-- Configuration Management
    |    +-- Analytics & Performance Dashboard
    |    +-- User & Payment Management
    |
    +-- Cache Layer (Redis)
    +-- Relational Database (PostgreSQL)
    +-- Object Storage (Palm Images + Face Images + Audio Assets)
    |
    +-- External AI Providers
         +-- Astrology Engine (AstroVisor)
         +-- Vision Model (Gemini Vision or similar)
         +-- Face Detection Model or API
         +-- Text Insight Model (Gemini Flash / OpenAI / Groq + Llama)
         +-- Speech-to-Text (Whisper or Google Speech-to-Text)
         +-- Text-to-Speech (Google TTS or equivalent Khmer-capable engine)
```

## 6. Provider Responsibility Model

### AstroVisor
Use AstroVisor only for:
- birth chart
- compatibility
- zodiac and date-based calculations
- astrology structure

Do not rely on AstroVisor for:
- face reading
- palm reading

### Vision provider
Use Gemini Vision or a similar multimodal vision model for:
- palm image understanding
- face image understanding
- extracting image features

### Face detection provider or model
Use a dedicated computer vision component when higher precision is needed for:
- face landmarks
- facial proportions
- segmentation or bounding box detection

### Internal interpretation engine
Use internal rules or mapping logic for:
- palm feature meaning
- face reading meaning
- confidence scoring
- culturally safe and non-deterministic interpretations

### Text model
Use Gemini Flash, Groq + Llama, or a lightweight OpenAI model to:
- convert structured outputs into Khmer-friendly text
- generate short voice-friendly answers
- generate premium reports

## 7. Core Experience Flow

### Voice-first user flow
1. user opens Lifestyle Machine inside Wing app
2. user taps microphone
3. user asks question in Khmer
4. speech-to-text converts Khmer speech into text
5. Request Orchestrator classifies intent
6. Quota Service checks allowance and subscription
7. system fetches cached result or calls required AI services
8. text response is generated
9. text-to-speech produces Khmer audio
10. app plays voice response and shows text response

## 8. Core Services

### 8.1 API Gateway
Responsibilities:
- TLS termination
- token validation
- request routing
- IP throttling
- abuse protection
- request logging

### 8.2 Auth Service
Responsibilities:
- validate Wing app identity
- map Wing user ID to Lifestyle Machine user
- issue authenticated user context
- support admin and support roles

### 8.3 User Profile Service
Responsibilities:
- store profile and preferences
- store birth date, birth time, language preference
- store consent flags for palm image upload, face upload, and audio generation
- store voice preference and playback settings if needed

### 8.4 Quota and Subscription Service
Responsibilities:
- enforce free daily limits and credit-based consumption
- track credit balance (earned vs. purchased)
- deduct 1 credit per AI question
- track active subscription status

Implementation:
- Redis for real-time credit deduction
- PostgreSQL for long-term balance ledger

Key patterns:
```text
balance:{user_id}
daily_free_usage:{user_id}:{date}
subscription:{user_id}
```

### 8.5 Payment Service
Responsibilities:
- subscription billing
- one-time premium report purchases
- **KHQR Generation:** Generate dynamic QR codes for credit top-ups and subscription activations on external messaging platforms.
- **Payment Webhooks:** Listen for payment completion from Wing/Bakong.
- ledger of transactions
- reconciliation
- payment event publishing

### 8.6 Request Orchestrator
Responsibilities:
- classify incoming request
- determine if request is free, premium, or report-grade
- decide whether to serve cached answer
- call speech, astrology, palm, and face models
- merge outputs into final response payload
- store request and cost metrics

Intent categories:
- daily insight
- horoscope
- compatibility
- palm reading
- face reading
- annual report
- conversational follow-up

### 8.7 Speech Layer

#### Speech-to-Text
Responsibilities:
- transcribe Khmer speech
- support short utterances and natural conversational input

Preferred options:
- OpenAI Whisper for MVP
- Google Speech-to-Text as alternative

#### Text-to-Speech
Responsibilities:
- convert final text response into Khmer audio
- return audio file or streaming-ready response
- keep response natural and short

Preferred options:
- Google Text-to-Speech for Khmer output

### 8.8 Image Understanding Layer

#### Palm Feature Extraction
Responsibilities:
- identify visible line patterns
- produce structured descriptors such as heart line, head line, life line, and clarity

#### Face Landmark / Attribute Detection
Responsibilities:
- identify face shape
- detect forehead, eyes, nose, lips, jawline, symmetry, and visible landmarks
- produce structured descriptors for interpretation

### 8.9 Interpretation Layer

#### Astrology Rules
Generated from AstroVisor outputs and internal formatting logic.

#### Palm Reading Rules
Maps palm features into soft lifestyle insights.

#### Face Reading Rules
Maps face shape and facial feature descriptors into non-deterministic personality or lifestyle themes.

Important:
- all rules must be framed as entertainment and lifestyle reflection
- do not present face readings as scientific truth
- do not infer sensitive traits such as health, ethnicity, religion, or financial worthiness

### 8.10 Prompt Builder
Responsibilities:
- build prompts from structured astrology, palm, and face outputs
- preserve friendly lifestyle tone
- keep answers concise for voice playback
- generate both speech-friendly and text-friendly outputs

Prompting rules:
- short sentences
- no deterministic claims
- no financial, legal, or medical advice
- phrasing must work naturally when spoken aloud

### 8.11 Safety Filter
Responsibilities:
- scan text before TTS
- block unsafe or misleading claims
- ensure all responses are bank-safe and entertainment-only

Disallowed examples:
- “You will become rich next month.”
- “Your face proves you are lucky in business.”
- “The stars say you should borrow money now.”

Allowed style:
- “This reading suggests a reflective and expressive personality.”
- “For entertainment and lifestyle insight only.”

### 8.12 Analytics Service
Responsibilities:
- usage analytics
- speech success rate
- transcript accuracy proxy metrics
- TTS playback completion
- conversion tracking
- AI cost by feature
- retention and engagement dashboards

**Core Business KPIs:**
- **ARPPU (Average Revenue Per Paying User):** Tracking top-up frequency and subscription retention.
- **Top-up Conversion Rate:** % of users who purchase a credit pack after hitting a 0-balance state.
- **Credit Velocity:** Average time taken to consume a purchased credit package.
- **Omni-channel Rev Share:** Revenue breakdown between Wing App, FB Messenger, and Telegram.
- **Gross Margin per Reading Type:** Profitability of Palm vs. Face vs. Horoscope (accounting for AI costs).
- **LTV (Lifetime Value):** Projected revenue per user over 6 months.
- **Retention (D1, D7, D30):** Stickiness of the lifestyle/horoscope daily habit.
- **AI Cost-to-Revenue Ratio:** Ensuring the cost of Gemini/Whisper/TTS remains below 20% of revenue.

**Technical Metrics:**
- voice question completion rate
- STT success rate
- TTS playback rate
- cache hit rate
- image analysis latency

### 8.13 Admin Service & Web Portal
The "Lifestyle Control Center" for business operations.

**Portal Features:**
- **Dynamic Configuration:** Update pricing, daily limits, and AI model routing without redeploying code.
- **Real-time Traffic Monitor:** Active users, voice query volume, and STT failure rates.
- **Financial Ledger:** Track successful KHQR top-ups, subscription revenue, and profit margins.
- **User Management:** Audit logs for user readings and manual credit adjustments if needed.

**Tech Stack:** Next.js (Dashboard) + Admin API (Node.js).

## 9. AI Provider Strategy

### 9.1 Speech-to-Text
Primary:
- Whisper

Alternative:
- Google Speech-to-Text

### 9.2 Astrology Engine
Primary:
- AstroVisor

Used for:
- birth chart
- compatibility
- zodiac and date-based calculations

### 9.3 Vision Layer
Primary:
- Gemini Vision or equivalent

Used for:
- palm image understanding
- face image understanding
- assisting with feature extraction
- descriptive multimodal reasoning

### 9.4 Face Detection Layer
Use one of:
- dedicated CV API
- open-source face landmark model
- custom detector
- multimodal model with structured extraction prompt

Used for:
- face landmarks
- facial proportions

### 9.5 Text Insight Model
Preferred low-cost options:
- Gemini Flash
- Groq + Llama
- lightweight OpenAI model

Used for:
- natural language generation
- short spoken-style output
- premium report generation

### 9.6 Text-to-Speech
Primary:
- Google Text-to-Speech or another Khmer-capable TTS provider

## 10. Cost Control Policy

- free users should primarily use cached daily insights
- speech responses should stay short
- reuse horoscope outputs daily
- do not run expensive premium model flows for free traffic
- reserve rich report generation for paying users
- use low-cost model routing by default
- cache text results before TTS where possible
- optionally cache TTS audio for repeated daily responses
- cap face analysis frequency for free users

## 11. Request Flows

### 11.1 Free voice horoscope request
1. user speaks in Khmer
2. speech-to-text transcribes input
3. quota check is performed
4. orchestrator checks horoscope cache
5. if hit, cached text is returned
6. cached or generated text is converted to Khmer voice
7. app receives audio + text

### 11.2 Premium compatibility voice request
1. user speaks compatibility request
2. STT transcribes request
3. subscription and quota are validated
4. orchestrator calls AstroVisor
5. Prompt Builder creates short spoken-friendly response
6. text insight model produces final answer
7. Safety Filter validates output
8. TTS generates Khmer voice
9. app receives text + audio

### 11.3 Palm reading request
1. user uploads palm image
2. optional voice request adds context
3. consent is verified
4. palm quota is checked
5. image is stored temporarily
6. vision layer extracts palm features
7. text insight model generates response
8. Safety Filter validates wording
9. TTS creates voice response
10. app receives text + audio and image retention policy is enforced

### 11.4 Face reading request
1. user uploads face image
2. optional voice question adds context
3. consent is verified
4. face quota is checked
5. image is stored temporarily
6. face landmark detector or vision model extracts structured face attributes
7. face interpretation rules produce structured reading themes
8. text insight model generates final response
9. Safety Filter validates output
10. TTS creates Khmer voice response
11. app receives text + audio

## 12. API Design

Base path:
```text
/api/v1
```

### 12.1 Profile
#### GET /profile
Returns user profile and preferences.

#### POST /profile
Creates or updates profile.

### 12.2 Quota
#### GET /quota
Returns remaining free and premium allowance.

### 12.3 Voice request
#### POST /voice/query
Accepts voice input and returns text + audio response metadata.

Response:
```json
{
  "transcript": "ថ្ងៃនេះខ្ញុំមានសំណាងទេ",
  "response_text": "ថ្ងៃនេះសម្រាប់អ្នកមានថាមពលវិជ្ជមាន...",
  "audio_url": "https://example/audio/resp123.mp3",
  "disclaimer": "For entertainment and lifestyle insight only."
}
```

### 12.4 Insights
#### POST /insights/daily
#### POST /insights/compatibility
#### POST /insights/palm
#### POST /insights/face

### 12.5 Billing
#### POST /billing/subscribe
#### POST /billing/report/purchase
#### GET /billing/history

## 13. Data Model

### users
- id
- wing_user_id
- name
- created_at
- updated_at

### user_profiles
- id
- user_id
- birth_date
- birth_time
- gender_optional
- language
- consent_palm_upload
- consent_face_upload
- consent_audio_generation
- preferences_json
- credit_balance (Total remaining questions)
- created_at
- updated_at

### subscriptions
- id
- user_id
- plan_name
- status
- started_at
- expires_at
- provider_reference
- created_at
- updated_at

### usage_events
- id
- user_id
- request_type
- input_mode
- cache_hit
- ai_provider_used
- vision_provider_used
- stt_provider_used
- tts_provider_used
- estimated_cost
- created_at

### voice_requests
- id
- user_id
- audio_path
- transcript
- language
- duration_ms
- stt_status
- created_at

### insight_requests
- id
- user_id
- request_type
- input_payload_json
- status
- created_at
- completed_at

### insight_results
- id
- request_id
- summary
- structured_output_json
- model_name
- safety_status
- disclaimer_text
- audio_path_optional
- created_at

### image_assets
- id
- user_id
- asset_type
- object_path
- region_hint_optional
- retention_until
- created_at

### payments
- id
- user_id
- payment_type
- amount
- currency
- provider
- provider_reference
- status
- created_at

## 14. Caching Strategy

Use Redis for:
- daily horoscope text
- daily horoscope audio where safe
- quota counters
- repeated compatibility outputs when acceptable
- common prompt fragments

Examples:
```text
daily:text:aries:2026-03-16
daily:audio:aries:2026-03-16:km
quota:u_123:2026-03-16
```

Rules:
- daily text TTL: 24 hours
- daily audio TTL: 24 hours
- quota TTL: end of local day
- do not persist user-sensitive generated audio or uploaded images longer than policy allows

## 15. Infrastructure

### Runtime (Railway.app)
- All services deployed as separate **Railway Services** within a single project.
- Automated CI/CD via GitHub integration.
- Environment-specific variables (Staging/Production).
- Internal networking (Railway Private Network) for inter-service communication.

### Storage
- **Managed PostgreSQL:** Hosted by Railway (Primary database).
- **Managed Redis:** Hosted by Railway (Quota counters, cache).
- **Object Storage:** Google Cloud Storage or AWS S3 (for image and audio assets).

### Networking
- private subnets for backend
- public gateway only
- secret manager for provider credentials

### Scalability
- stateless API servers
- background workers for TTS, detection, and report generation if needed
- autoscaling based on queue depth and latency

## 16. Security and Compliance

- encrypt data in transit and at rest
- minimize storage of user audio and images
- define retention period for voice and image assets
- allow deletion workflows
- clear entertainment disclaimer
- no direct integration with core ledger
- all mini-app communication through secure APIs
- audit all billing and provider calls
- do not infer sensitive categories from face images

## 17. Observability

Track:
- STT latency
- TTS latency
- transcript failure rate
- image analysis latency
- face detection success rate
- audio playback generation success
- cache hit rate
- cost per voice interaction
- cost per face reading
- premium conversion
- image upload success rate

Alerts:
- STT failure spike
- TTS provider outage
- vision provider outage
- AI cost spike
- unusual voice or image traffic surge
- payment callback failures

## 18. Delivery Roadmap

### Phase 1: Voice-first MVP
- Khmer voice input
- Khmer voice output
- free daily insight
- quota control
- subscription
- compatibility
- basic palm reading
- analytics

### Phase 2: Image interpretation expansion
- face reading
- image consent management
- richer structured extraction
- premium reports

### Phase 3: Scale and optimization
- streaming voice interaction
- richer conversational follow-up
- advanced personalization
- cost-aware model routing
- ops dashboard for profit and margin tracking

## 19. Final Recommendation

Build Lifestyle Machine as a voice-first Khmer AI mini-app with a modular interpretation pipeline:
- AstroVisor for astrology only
- vision tools for palm and face feature extraction
- internal rules for interpretation
- low-cost text model for final response
- Khmer TTS for spoken answer

That gives the AI tool enough structure to actually do the job, instead of pretending one provider handles everything.
## 20. Deployment Strategy (Railway.app)

### Project Structure: Monorepo
To utilize Railway efficiently, the project will be structured as a monorepo:
- `/services/api-gateway`
- `/services/orchestrator`
- `/services/auth`
- `/services/payment`
- `/services/shared` (Common types, interpretation rules, interpretation rules)

### Infrastructure Components:
1. **API Service:** Primary entry point. Handles Gateway, Auth, and Routing.
2. **Worker Service:** (Optional) Handles long-running TTS or Report generation tasks via a queue if volume scales.
3. **Database Service:** Railway Managed PostgreSQL (Primary DB).
4. **Redis Service:** Railway Managed Redis (Quota + Caching).

### Environment Configuration:
- `RAILWAY_STATIC_URL`: Public endpoint for Wing SDK / Messaging Webhooks.
- `DATABASE_URL`: Injected by Railway.
- `REDIS_URL`: Injected by Railway.
- `AI_PROVIDER_KEYS`: Encrypted secrets.

### Scaling & Costs:
- Use **Horizontal Autoscaling** (Railway's target-based scaling) during peak Cambodian hours (typically evening).
- Pin memory limits to reduce unexpected cost spikes in a shared environment.
