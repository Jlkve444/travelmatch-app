-- TravelMatch Database Schema
-- Supabase PostgreSQL with pgvector extension

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) CHECK (auth_provider IN ('google', 'apple', 'linkedin')),
    passkey_credential_id TEXT,
    kyc_status VARCHAR(20) DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'verified', 'rejected')),
    kyc_provider VARCHAR(50) CHECK (kyc_provider IN ('stripe_identity', 'passbase')),
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
    vibe_embedding VECTOR(256),
    content_moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (content_moderation_status IN ('approved', 'flagged', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vibe Profiles table
CREATE TABLE vibe_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio_text TEXT,
    travel_style_tags JSONB DEFAULT '[]',
    budget_preference VARCHAR(20) CHECK (budget_preference IN ('budget', 'mid', 'luxury')),
    flexibility VARCHAR(20) CHECK (flexibility IN ('low', 'medium', 'high')),
    activity_level INTEGER CHECK (activity_level >= 0 AND activity_level <= 10),
    social_preference VARCHAR(20) CHECK (social_preference IN ('introvert', 'ambivert', 'extrovert')),
    early_bird BOOLEAN DEFAULT FALSE,
    digital_nomad BOOLEAN DEFAULT FALSE,
    languages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination JSONB NOT NULL, -- { lat: number, lng: number, name: string, country_code: string }
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0 AND max_participants <= 20),
    budget_range JSONB NOT NULL, -- { min: number, max: number, currency: string }
    trip_type VARCHAR(50) CHECK (trip_type IN ('coworking', 'leisure', 'mixed', 'adventure')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'in_progress', 'completed', 'cancelled')),
    moodboard_urls JSONB DEFAULT '[]',
    vibe_embedding VECTOR(256),
    requirements JSONB DEFAULT '{}', -- { min_age: number, verified_only: boolean }
    seo_slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip Applications table
CREATE TABLE trip_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    message TEXT,
    voice_memo_url TEXT,
    voice_memo_duration INTEGER,
    vibe_match_score INTEGER CHECK (vibe_match_score >= 0 AND vibe_match_score <= 100),
    viewed_by_creator_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, applicant_id)
);

-- Trip Members table
CREATE TABLE trip_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(trip_id, user_id)
);

-- Chat Rooms table
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) CHECK (type IN ('direct', 'group')),
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    name VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Participants table
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_typing BOOLEAN DEFAULT FALSE,
    UNIQUE(room_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) CHECK (type IN ('text', 'image', 'voice', 'poll', 'system', 'call_invite')),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    would_travel_again BOOLEAN,
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, reviewer_id, reviewee_id)
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    paid_by UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('accommodation', 'food', 'transport', 'activity', 'other')),
    split_type VARCHAR(20) CHECK (split_type IN ('equal', 'percentage', 'custom')),
    splits JSONB DEFAULT '[]',
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Safety Reports table
CREATE TABLE safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    reason VARCHAR(50) CHECK (reason IN ('harassment', 'scam', 'inappropriate', 'other')),
    description TEXT,
    evidence_urls JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_vibe_embedding ON users USING ivfflat (vibe_embedding vector_cosine_ops);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_vibe_embedding ON trips USING ivfflat (vibe_embedding vector_cosine_ops);
CREATE INDEX idx_applications_trip ON trip_applications(trip_id);
CREATE INDEX idx_applications_applicant ON trip_applications(applicant_id);
CREATE INDEX idx_applications_status ON trip_applications(status);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;

-- Users can read all verified users
CREATE POLICY "Users can read verified users" ON users
    FOR SELECT USING (kyc_status = 'verified' OR id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Trips are readable by all verified users when open
CREATE POLICY "Verified users can read open trips" ON trips
    FOR SELECT USING (
        status IN ('open', 'in_progress', 'completed') 
        OR creator_id = auth.uid()
    );

-- Only creators can update their trips
CREATE POLICY "Creators can update own trips" ON trips
    FOR UPDATE USING (creator_id = auth.uid());

-- Applications: applicants can read their own, creators can read for their trips
CREATE POLICY "Users can read own applications" ON trip_applications
    FOR SELECT USING (applicant_id = auth.uid() OR trip_id IN (
        SELECT id FROM trips WHERE creator_id = auth.uid()
    ));

-- Messages: participants can read room messages
CREATE POLICY "Participants can read messages" ON messages
    FOR SELECT USING (room_id IN (
        SELECT room_id FROM chat_participants WHERE user_id = auth.uid()
    ));

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vibe_profiles_updated_at BEFORE UPDATE ON vibe_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON trip_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
