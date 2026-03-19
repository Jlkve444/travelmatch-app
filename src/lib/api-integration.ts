// API Integration Layer for TravelMatch
// Connects frontend components with Supabase backend

import { supabase } from '@/lib/supabase/client'
import type { Trip, TripApplication, User, ChatRoom, Message } from '@/lib/supabase/client'

// ============================================
// TRIPS API
// ============================================
export const tripsApi = {
  // Get all trips with filters
  async getTrips(filters?: {
    status?: string
    destination?: string
    startDate?: string
    endDate?: string
    tripType?: string
  }) {
    let query = supabase
      .from('trips')
      .select(`
        *,
        creator:users(id, name, avatar_url, trust_score, kyc_status)
      `)
      .eq('status', filters?.status || 'open')
      .order('created_at', { ascending: false })

    if (filters?.destination) {
      query = query.ilike('destination->>name', `%${filters.destination}%`)
    }

    if (filters?.tripType) {
      query = query.eq('trip_type', filters.tripType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching trips:', error)
      throw error
    }
    return data
  },

  // Get single trip with details
  async getTrip(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        creator:users(id, name, avatar_url, trust_score, kyc_status),
        applications:trip_applications(
          *,
          applicant:users(id, name, avatar_url, trust_score, vibe_profile:bio_text)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching trip:', error)
      throw error
    }
    return data
  },

  // Create new trip
  async createTrip(trip: Partial<Trip>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...trip,
        creator_id: user.id,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating trip:', error)
      throw error
    }
    return data
  },

  // Update trip
  async updateTrip(id: string, updates: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating trip:', error)
      throw error
    }
    return data
  },

  // Close trip (stop accepting applications)
  async closeTrip(id: string) {
    return this.updateTrip(id, { status: 'closed' })
  },

  // Delete trip
  async deleteTrip(id: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting trip:', error)
      throw error
    }
  },
}

// ============================================
// APPLICATIONS API
// ============================================
export const applicationsApi = {
  // Apply to a trip
  async applyToTrip(tripId: string, application: {
    message?: string
    voice_memo_url?: string
    voice_memo_duration?: number
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('trip_applications')
      .insert({
        trip_id: tripId,
        applicant_id: user.id,
        status: 'pending',
        ...application,
      })
      .select()
      .single()

    if (error) {
      console.error('Error applying to trip:', error)
      throw error
    }
    return data
  },

  // Get applications for a trip (creator only)
  async getApplications(tripId: string) {
    const { data, error } = await supabase
      .from('trip_applications')
      .select(`
        *,
        applicant:users(
          id,
          name,
          avatar_url,
          trust_score,
          vibe_profile:bio_text
        )
      `)
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
    return data
  },

  // Get my applications
  async getMyApplications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('trip_applications')
      .select(`
        *,
        trip:trips(*)
      `)
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching my applications:', error)
      throw error
    }
    return data
  },

  // Update application status (accept/reject)
  async updateStatus(id: string, status: 'accepted' | 'rejected') {
    const { data, error } = await supabase
      .from('trip_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      throw error
    }
    return data
  },

  // Withdraw application
  async withdraw(id: string) {
    return this.updateStatus(id, 'withdrawn')
  },
}

// ============================================
// USERS API
// ============================================
export const usersApi = {
  // Get current user profile
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        vibe_profile:vibe_profiles(*)
      `)
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      throw error
    }
    return data
  },

  // Get user by ID
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        vibe_profile:vibe_profiles(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      throw error
    }
    return data
  },

  // Update user profile
  async updateProfile(updates: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }
    return data
  },

  // Update vibe profile
  async updateVibeProfile(profile: {
    bio_text?: string
    travel_style_tags?: string[]
    budget_preference?: string
    flexibility?: string
    activity_level?: number
    social_preference?: string
    early_bird?: boolean
    digital_nomad?: boolean
    languages?: string[]
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('vibe_profiles')
      .upsert({
        user_id: user.id,
        ...profile,
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating vibe profile:', error)
      throw error
    }
    return data
  },
}

// ============================================
// CHAT API
// ============================================
export const chatApi = {
  // Get chat rooms for current user
  async getChatRooms() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        room:chat_rooms(
          *,
          participants:chat_participants(
            user:users(id, name, avatar_url)
          ),
          last_message:messages(content, created_at, sender_id)
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching chat rooms:', error)
      throw error
    }
    return data
  },

  // Get messages for a room
  async getMessages(roomId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, name, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
    return data
  },

  // Send message
  async sendMessage(roomId: string, content: string, type: string = 'text') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_id: user.id,
        content,
        type,
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      throw error
    }
    return data
  },

  // Create chat room for trip
  async createTripChat(tripId: string, name: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create room
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        type: 'group',
        trip_id: tripId,
        name,
        created_by: user.id,
      })
      .select()
      .single()

    if (roomError) {
      console.error('Error creating chat room:', roomError)
      throw roomError
    }

    // Add creator as participant
    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert({
        room_id: room.id,
        user_id: user.id,
      })

    if (participantError) {
      console.error('Error adding participant:', participantError)
      throw participantError
    }

    return room
  },
}

// ============================================
// REVIEWS API
// ============================================
export const reviewsApi = {
  // Get reviews for a user
  async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users(id, name, avatar_url),
        trip:trips(title, destination)
      `)
      .eq('reviewee_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
    return data
  },

  // Create review
  async createReview(review: {
    trip_id: string
    reviewee_id: string
    rating: number
    would_travel_again: boolean
    comment: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        reviewer_id: user.id,
        is_public: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      throw error
    }
    return data
  },
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================
export const realtimeApi = {
  // Subscribe to new messages in a room
  subscribeToMessages(roomId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        callback(payload.new as Message)
      })
      .subscribe()
  },

  // Subscribe to application updates for a trip
  subscribeToApplications(tripId: string, callback: (application: TripApplication) => void) {
    return supabase
      .channel(`applications:${tripId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trip_applications',
        filter: `trip_id=eq.${tripId}`,
      }, (payload) => {
        callback(payload.new as TripApplication)
      })
      .subscribe()
  },

  // Subscribe to trip updates
  subscribeToTrips(callback: (trip: Trip) => void) {
    return supabase
      .channel('trips')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trips',
      }, (payload) => {
        callback(payload.new as Trip)
      })
      .subscribe()
  },
}

// ============================================
// AUTH HELPERS
// ============================================
export const authApi = {
  // Sign up with email
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign in with OAuth
  async signInWithOAuth(provider: 'google' | 'apple') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },
}
