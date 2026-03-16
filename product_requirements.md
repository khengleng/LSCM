# product_requirements.md — Lifestyle Machine Product Requirements

## 1. Product Name
Lifestyle Machine

## 2. Product Summary
Lifestyle Machine is a voice-first AI lifestyle mini-app for the Cambodia market, intended to run inside a banking application such as Wing Bank.

The product is designed for users who prefer speaking over typing. Users ask questions in Khmer using voice, and the app replies with:
- Khmer voice output
- Khmer text output

The product offers:
- daily horoscope and lifestyle insights
- love compatibility analysis
- palm reading
- face reading
- premium reports
- subscription upsell
- **Omni-channel support:** Wing Mini-App, Facebook Messenger, and Telegram.
- **KHQR Top-ups:** QR-based credit purchasing for external messaging platforms.

## 3. Primary Product Goal
Increase user engagement inside the banking app while creating a profitable digital subscription and premium-report business.

## 4. Core UX Principle
The product should feel like:

Tap → Speak → Hear the answer → Read the answer

The experience should feel like a Khmer voice lifestyle assistant, not a text-heavy chatbot.

## 5. Target Users
Primary users:
- Cambodian users who prefer voice interaction
- users who struggle with Khmer text input
- users interested in astrology, palm reading, face reading, and lifestyle guidance

Secondary users:
- users who want entertainment and daily engagement inside the banking app
- users who may later buy premium reports

## 6. Supported Languages
- Khmer as default
- English optional later
- all MVP voice responses should prioritize Khmer

## 7. Plans and Entitlements

### Free Plan
- 3 questions per day
- 1 palm reading per week
- 1 face reading per week
- voice input enabled
- voice + text output enabled
- mostly cached results for low cost

### Premium Plan
- $3 per month
- 10 AI questions per day
- up to 5 palm readings per week
- up to 5 face readings per week
- voice input enabled
- voice + text output enabled
- full AI-generated responses

### Credit Packages (Top-up)
- Starter: $1 for 5 Questions
- Basic: $2 for 15 Questions
- Pro: $5 for 50 Questions

### Premium Reports
- palm reading report: $2
- face reading report: $3
- love compatibility report: $3
- yearly prediction report: $5

## 8. Primary User Flows

### Flow 1: Daily voice horoscope
1. User opens Lifestyle Machine.
2. User taps microphone.
3. User asks a Khmer voice question such as “What is my luck today?”
4. System transcribes audio to text.
5. System checks quota.
6. System serves cached or generated answer.
7. System shows Khmer text answer.
8. System plays Khmer voice answer.

### Flow 2: Love compatibility
1. User opens compatibility feature.
2. User enters or selects profile data for two people.
3. User can also ask a voice question.
4. System checks quota or premium status.
5. System calculates compatibility.
6. System generates Khmer text answer.
7. System generates Khmer voice playback.

### Flow 3: Palm reading
1. User opens palm reading feature.
2. User uploads or captures palm image.
3. User optionally asks a voice question.
4. System verifies consent.
5. System checks palm-reading entitlement.
6. System analyzes image.
7. System produces palm interpretation.
8. System returns Khmer text + voice answer.

### Flow 4: Face reading
1. User opens face reading feature.
2. User uploads or captures face image.
3. User optionally adds a voice question.
4. System verifies consent.
5. System checks entitlement.
6. System extracts facial features.
7. System maps them through interpretation logic.
8. System returns Khmer text + voice answer.

### Flow 5: Subscription upgrade
1. User reaches free limit or taps premium feature.
2. System shows premium benefits.
3. User subscribes for $3/month.
4. Entitlements are updated immediately.
5. User can continue with premium usage.

### Flow 6: Credit Top-up (Messenger/Telegram)
1. User hits question limit.
2. Bot sends Credit Pack options ($1, $2, $5).
3. User selects a package.
4. Bot generates a dynamic **KHQR Code**.
5. User pays via their banking app.
6. System detects payment via webhook/polling.
7. Bot sends confirmation and updates credit balance.

### Flow 7: Buy premium report
1. User completes an insight flow.
2. System offers deeper premium report.
3. User confirms purchase.
4. Payment succeeds.
5. System generates report.
6. User receives detailed text + optional audio summary.

### Flow 8: Admin Operations
1. Business owner logs into Admin Web Portal.
2. Owner views real-time traffic (total users, active voice sessions).
3. Owner checks payment dashboard (KHQR top-ups, revenue by platform).
4. Owner updates daily question limits for free users.
5. Owner reviews STT accuracy and transcript logs.

## 9. Required Screens

### 9.1 Home screen
Must include:
- greeting
- microphone button
- quick action cards
- daily insight card
- premium upsell area
- recent interactions

Quick action cards:
- Daily Insight
- Love Compatibility
- Palm Reading
- Face Reading
- Premium Reports

### 9.2 Voice query screen
Must include:
- large microphone control
- live recording status
- waveform or activity indicator
- transcript preview
- cancel and retry controls

### 9.3 Result screen
Must include:
- result title
- Khmer text answer
- audio playback control
- replay button
- disclaimer
- share button
- premium upsell if applicable

### 9.4 Image upload screen
Must include:
- camera upload
- gallery upload
- image guidelines
- consent checkbox
- retake / reupload option

### 9.5 Compatibility input screen
Must include:
- person A profile fields
- person B profile fields
- optional voice question
- submit action

### 9.6 Subscription screen
Must include:
- Free vs Premium comparison
- $3/month pricing
- feature differences
- purchase CTA
- restore purchase option if needed

### 9.7 Premium report screen
Must include:
- list of reports
- report prices
- sample preview
- purchase CTA

### 9.8 Profile and settings
Must include:
- birth date
- birth time
- language setting
- audio playback preference
- consent management
- subscription status

### 9.9 Admin Web Portal Screens
- **Login:** Secure staff-only access.
- **Overview Dashboard:** Revenue charts, active users, and system health.
- **Configuration Manager:** UI to edit `business_model` settings (limits, prices).
- **Payment Ledger:** Searchable table of all transactions and order statuses.
- **User Insights:** Aggregate metrics on feature usage (Horoscope vs Palm vs Face).

## 10. Functional Requirements

### Voice input
- app must support Khmer voice recording
- system must upload audio to backend
- backend must return transcript
- user must be able to retry if transcript is wrong

### Voice output
- system must return audio URL or playable audio asset
- playback should start quickly
- replay must be supported

### Text output
- every voice response must also appear as text
- text must be readable and concise

### Quotas
- free and premium entitlements must be enforced
- system must expose remaining usage to frontend
- limits must reset automatically based on configured rules

### Image analysis
- system must accept palm and face uploads
- system must verify consent before analysis
- system must support upload failure handling
- system must support validation of file type and size

### Payments
- system must support premium subscription purchase
- system must support one-time premium report purchases
- payment confirmation must unlock entitlement immediately
- billing state must be queryable from frontend

### Analytics
- every key action must emit analytics events
- subscription funnel must be measurable
- voice usage and completion must be measurable

### Admin Web Portal (New)
- **Dashboard Data:** Fetch real-time metrics from the database and analytics service.
- **Control Plane:** Ability to update configuration parameters (stored in DB or Redis).
- **Audit Logs:** View interaction history for debugging and safety monitoring.
- **Payment Verification:** Manually verify KHQR status if webhook fails.

## 11. Non-Functional Requirements

### Performance
- text result should return quickly for cached flows
- voice playback generation should feel responsive
- app should remain usable on average mobile networks in Cambodia

### Scalability
- backend services must scale horizontally
- quotas and caching must not rely on in-memory local state
- storage must handle images and audio assets

### Security
- token-based authentication required
- uploads must be securely stored
- audio and image retention must follow configurable policy
- sensitive data must be encrypted in transit and at rest

### Reliability
- external AI failures must return graceful error messages
- retries and timeouts must be handled
- provider outages must not break the entire app if cached fallback exists

## 12. Content Safety Requirements
- all results must be entertainment and lifestyle only
- no financial, medical, or legal advice
- no deterministic future claims
- no harmful or discriminatory language
- no sensitive trait inference from face images
- disclaimer must appear on all generated insights

Required disclaimer:
“For entertainment and lifestyle insight only.”

## 13. Event Tracking Requirements

Track at minimum:
- app_opened
- microphone_tapped
- voice_query_submitted
- transcript_generated
- insight_generated
- audio_played
- image_uploaded
- palm_reading_started
- face_reading_started
- premium_upsell_viewed
- subscription_started
- subscription_completed
- premium_report_purchased
- quota_limit_reached

## 14. KPI Targets
- adoption rate target: 15–25%
- premium conversion target: 4%
- average requests per premium user per day: 5
- AI cost per request target: below $0.01
- cache hit rate target: above 70%
- monthly profit target: above $40,000 in target scenario
- voice usage rate target: above 60%
- 7-day retention target: above 40%

## 15. API Expectations for Generated Backend
The generated system should include API groups for:
- auth
- profile
- quota
- voice query
- daily insights
- compatibility
- palm reading
- face reading
- billing
- premium reports
- analytics ingestion if needed

## 16. Database Expectations
The generated system should include schema for:
- users
- user_profiles
- subscriptions
- usage_events
- voice_requests
- insight_requests
- insight_results
- image_assets
- payments

## 17. Configuration Expectations
The generated system should read configurable settings from:
- business_model.md
- architecture.md

The implementation should not hardcode pricing or limits when configuration can be used.

## 18. Output Expectations for AI Coding Tool
Generate:
- backend service structure
- API contracts
- database schema and migrations
- quota and entitlement middleware
- payment hooks
- voice pipeline integration points
- image upload flow
- analytics instrumentation points
- environment configuration examples

## 19. MVP Acceptance Criteria
The MVP is successful if it can:
- let users ask Khmer voice questions
- reply with Khmer text and voice
- support daily insights, compatibility, palm reading, and face reading
- enforce free and premium limits correctly
- process premium subscription and premium report purchase
- show usage and billing state in the UI
- operate with configurable product economics from business_model.md

## 20. Final Build Guidance
Build the product as a fintech-style mini-app with:
- simple mobile-first flows
- clear subscription upsell
- strong quota enforcement
- clean modular backend
- low-cost AI routing
- safe, short, voice-friendly outputs

Do not build this as a generic chatbot. Build it as a structured product with purpose-built flows.
