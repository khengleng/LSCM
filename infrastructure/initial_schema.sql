-- Initial Schema for Lifestyle Machine

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wing_user_id VARCHAR(255) UNIQUE,
    fb_psid VARCHAR(255) UNIQUE,
    telegram_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    birth_date DATE,
    birth_time TIME,
    gender VARCHAR(50),
    language VARCHAR(10) DEFAULT 'km',
    consent_palm_upload BOOLEAN DEFAULT FALSE,
    consent_face_upload BOOLEAN DEFAULT FALSE,
    credit_balance INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    type VARCHAR(50), -- 'topup', 'subscription', 'report'
    status VARCHAR(50) DEFAULT 'pending',
    provider VARCHAR(50), -- 'wing', 'bakong'
    provider_ref VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_wing_id ON users(wing_user_id);
CREATE INDEX idx_users_fb_psid ON users(fb_psid);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

CREATE TABLE IF NOT EXISTS system_configs (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    category VARCHAR(50), -- 'api_keys', 'business_limits', 'model_routing'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Configs
INSERT INTO system_configs (key, value, category) VALUES 
('free_daily_limit', '3', 'business_limits'),
('premium_daily_limit', '10', 'business_limits'),
('openai_api_key', '', 'api_keys'),
('gemini_api_key', '', 'api_keys'),
('telegram_bot_token', '', 'channel_configs'),
('facebook_messenger_page_token', '', 'channel_configs'),
('facebook_messenger_verify_token', '', 'channel_configs'),
('google_stt_url', 'https://speech.googleapis.com/v1/speech:recognize', 'api_keys'),
('google_tts_url', 'https://texttospeech.googleapis.com/v1/text:synthesize', 'api_keys'),
('admin_access_token', 'lifestyle-machine-ultra-secret-2026', 'security')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50), -- 'speech_to_text', 'interpretation', 'palm_analysis'
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
