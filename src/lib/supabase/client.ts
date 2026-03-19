import { createClient } from '@supabase/supabase-js'

// Use environment variables for production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://apubzmnrajxutwlfttqh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_E0Cwb-PKxHWocq2Y0TcDvQ_aGYW6f2X'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Types for database tables
export type User = {
  id: string
  email: string
  auth_provider: 'google' | 'apple' | 'linkedin'
  passkey_credential_id?: string
  kyc_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  kyc_provider?: 'stripe_identity' | 'passbase'
  kyc_verified_at?: string
  trust_score: number
  vibe_embedding?: number[]
  content_moderation_status: 'approved' | 'flagged' | 'blocked'
  created_at: string
  updated_at: string
}

export type VibeProfile = {
  id: string
  user_id: string
  bio_text: string
  travel_style_tags: string[]
  budget_preference: 'budget' | 'mid' | 'luxury'
  flexibility: 'low' | 'medium' | 'high'
  activity_level: number
  social_preference: 'introvert' | 'ambivert' | 'extrovert'
  early_bird: boolean
  digital_nomad: boolean
  languages: string[]
  created_at: string
  updated_at: string
}

export type Trip = {
  id: string
  creator_id: string
  title: string
  description: string
  destination: {
    lat: number
    lng: number
    name: string
    country_code: string
  }
  start_date: string
  end_date: string
  max_participants: number
  budget_range: {
    min: number
    max: number
    currency: string
  }
  trip_type: 'coworking' | 'leisure' | 'mixed' | 'adventure'
  status: 'draft' | 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled'
  moodboard_urls?: string[]
  vibe_embedding?: number[]
  requirements?: {
    min_age?: number
    verified_only?: boolean
  }
  seo_slug?: string
  created_at: string
  updated_at: string
}

export type TripApplication = {
  id: string
  trip_id: string
  applicant_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  message?: string
  voice_memo_url?: string
  voice_memo_duration?: number
  vibe_match_score?: number
  viewed_by_creator_at?: string
  created_at: string
  updated_at: string
}
