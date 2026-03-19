import { supabase } from '@/lib/supabase/client'
import type { Trip, TripApplication, User } from '@/lib/supabase/client'

// Trip API
export const tripApi = {
  // Get all trips
  async getTrips(filters?: {
    status?: string
    destination?: string
    startDate?: string
    endDate?: string
  }) {
    let query = supabase
      .from('trips')
      .select(`
        *,
        creator:users(id, name, avatar_url, trust_score, kyc_status)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (filters?.destination) {
      query = query.ilike('destination->>name', `%${filters.destination}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // Get single trip
  async getTrip(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        creator:users(id, name, avatar_url, trust_score, kyc_status),
        applications:trip_applications(*, applicant:users(id, name, avatar_url, trust_score))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create trip
  async createTrip(trip: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single()

    if (error) throw error
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

    if (error) throw error
    return data
  },

  // Delete trip
  async deleteTrip(id: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Application API
export const applicationApi = {
  // Apply to trip
  async applyToTrip(application: Partial<TripApplication>) {
    const { data, error } = await supabase
      .from('trip_applications')
      .insert(application)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get applications for a trip
  async getApplications(tripId: string) {
    const { data, error } = await supabase
      .from('trip_applications')
      .select(`
        *,
        applicant:users(id, name, avatar_url, trust_score, vibe_profile:bio_text)
      `)
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Update application status
  async updateApplicationStatus(id: string, status: 'accepted' | 'rejected') {
    const { data, error } = await supabase
      .from('trip_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// User API
export const userApi = {
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user by ID
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}

// Chat API
export const chatApi = {
  // Get chat rooms for user
  async getChatRooms(userId: string) {
    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        room:chat_rooms(*, 
          participants:chat_participants(user:users(id, name, avatar_url)),
          last_message:messages(content, created_at)
        )
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  // Get messages for room
  async getMessages(roomId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, name, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  // Send message
  async sendMessage(message: { room_id: string; content: string; type?: string }) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Subscribe to new messages
  subscribeToMessages(roomId: string, callback: (message: any) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, callback)
      .subscribe()
  },
}

// Real-time subscriptions
export const realtime = {
  // Subscribe to trip updates
  subscribeToTrips(callback: (payload: any) => void) {
    return supabase
      .channel('trips')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trips',
      }, callback)
      .subscribe()
  },

  // Subscribe to application updates
  subscribeToApplications(tripId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`applications:${tripId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trip_applications',
        filter: `trip_id=eq.${tripId}`,
      }, callback)
      .subscribe()
  },
}
