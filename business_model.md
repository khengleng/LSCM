# business_model.md — Lifestyle Machine Configuration

## 1. Product Overview

Lifestyle Machine is a voice-first AI lifestyle mini‑app designed for the Cambodia market and integrated into a banking application such as Wing Bank.

Core features:
- Voice-based questions in Khmer
- Horoscope insights
- Love compatibility
- Palm reading
- Face reading
- AI voice + text responses

The platform must remain profitable while supporting large user volumes.

---

# 2. Pricing Configuration

pricing:
  free_plan:
    name: "Free"
    price_monthly: 0
    limits:
      questions_per_day: 3
      palm_reading_per_week: 1
      face_reading_per_week: 1
      voice_enabled: true

  premium_plan:
    name: "Premium"
    price_monthly: 3
    limits:
      questions_per_day: 10
      palm_reading_per_week: 5
      face_reading_per_week: 5
      voice_enabled: true

  credit_packages:
    starter:
      price: 1
      questions: 5
    basic:
      price: 2
      questions: 15
    pro:
      price: 5
      questions: 50

  premium_reports:
    palm_reading_report:
      price: 2
    face_reading_report:
      price: 3
    love_compatibility_report:
      price: 3
    yearly_prediction_report:
      price: 5

---

# 3. Usage Assumptions

market:
  total_bank_users: 3000000
  adoption_rate: 0.20
  active_users: 600000

conversion:
  premium_conversion_rate: 0.04
  premium_users: 24000

---

# 4. Revenue Projection

revenue_model:

  subscriptions:
    premium_users: 24000
    price_monthly: 3
    monthly_revenue: 72000

  premium_reports:
    purchase_rate: 0.15
    buyers: 3600
    average_price: 3
    monthly_revenue: 10800

  total_monthly_revenue: 82800

---

# 5. AI Cost Model

ai_costs_per_request:
  speech_to_text: 0.001
  llm_processing: 0.004
  text_to_speech: 0.001
  vision_processing: 0.002

  total_cost_per_request: 0.008

usage_pattern:
  avg_requests_per_user_per_day: 5
  premium_users: 24000
  monthly_requests: 3600000

monthly_ai_cost:
  estimated_cost: 28800

---

# 6. Infrastructure Cost

infrastructure:

  api_servers: 4000
  redis_cluster: 1500
  postgres_database: 1200
  object_storage: 800
  gateway_cdn: 1500
  monitoring_logging: 800

  total_monthly_infrastructure_cost: 10000

---

# 7. Payment Processing

payments:
  transaction_fee_percent: 3
  monthly_fee_estimate: 2484

---

# 8. Financial Summary

financials:

  monthly_revenue: 82800
  ai_cost: 28800
  infrastructure_cost: 10000
  payment_cost: 2484

  total_cost: 41284
  monthly_profit: 41516

  profit_margin_percent: 50

---

# 9. Cost Control Rules

cost_controls:

  free_users_use_cached_results: true
  max_free_questions_per_day: 3
  vision_calls_limited_for_free_users: true
  speech_responses_short: true
  cache_daily_horoscope: true
  cache_tts_audio: optional

---

# 10. KPI Targets

kpi_targets:

  adoption_rate_target: 0.20
  premium_conversion_target: 0.04
  average_questions_per_user: 5

  ai_cost_per_request_target: 0.01
  cache_hit_rate_target: 0.70

  arppu_target: 3
  monthly_profit_target: 40000

---

# 11. Scaling Model

scaling_projection:

  600k_users:
    revenue: 82800
    profit: 41516

  1m_users:
    revenue: 138000
    profit: 70000

  2m_users:
    revenue: 276000
    profit: 140000

---

# 12. Implementation Notes

Important for AI development tools:

1. Pricing and quotas must be configurable from this file.
2. AI routing should use cheapest model by default.
3. Vision analysis must only trigger when image uploaded.
4. Cached horoscope responses should avoid repeated AI calls.
5. Voice responses must be short to reduce TTS cost.
6. Premium features unlock additional AI request limits.

---

# 13. Admin Portal Tracking

The following metrics must be visible in the Admin Web Portal for operational control:

1. **Daily Traffic:** Hourly breakdown of voice queries and image uploads.
2. **Revenue Stream:** Real-time visibility into KHQR payments vs. Subscription renewals.
3. **AI Provider Health:** Latency and success rates for Whisper, Gemini, and TTS.
4. **Profitability Monitor:** Current AI cost vs. Revenue for the last 24h, 7d, and 30d.
5. **Conversion Funnel:** % of free users hitting limits who successfully top up.
