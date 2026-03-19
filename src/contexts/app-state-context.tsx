'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from './auth-context'
import { PostgrestError } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only on client-side
let supabase: ReturnType<typeof createClient> | null = null

if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export type Trip = {
  id: string
  title: string
  description?: string
  destination: string
  country_code: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  budget_range: { min: number; max: number; currency: string }
  image_url: string
  creator: {
    id: string
    name: string
    avatar_url: string
    verified: boolean
  } | null
  tags: string[]
  created_at: string
}

export type UserProfile = {
  id: string
  name: string
  avatar_url: string
  bio?: string
  verified: boolean
  trust_score: number
  trips_joined: number
  trips_created: number
  home_base?: string
  languages: string[]
}

// Type for inserting new trips
type TripInsert = {
  title: string
  description?: string
  destination: string
  country_code: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  budget_range: { min: number; max: number; currency: string }
  image_url: string
  creator_id?: string
  tags: string[]
}

type AppStateContextType = {
  trips: Trip[]
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  fetchTrips: () => Promise<void>
  fetchUserProfile: (userId: string) => Promise<void>
  createTrip: (trip: TripInsert) => Promise<{ error: PostgrestError | null }>
  applyToTrip: (tripId: string, message: string) => Promise<{ error: PostgrestError | null }>
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTrips = async () => {
    if (!supabase) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTrips(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setUserProfile(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createTrip = async (tripData: TripInsert) => {
    if (!supabase) return { error: new Error('Supabase not initialized') as PostgrestError }
    setLoading(true)
    setError(null)
    try {
      const insertData = {
        ...tripData,
        creator_id: user?.id,
      }
      
      const { error } = await supabase
        .from('trips')
        .insert(insertData as any)
      
      if (error) throw error
      await fetchTrips()
      return { error: null }
    } catch (err: any) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const applyToTrip = async (tripId: string, message: string) => {
    if (!supabase) return { error: new Error('Supabase not initialized') as PostgrestError }
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('trip_applications')
        .insert({
          trip_id: tripId,
          user_id: user?.id,
          message,
          status: 'pending',
        } as any)
      
      if (error) throw error
      return { error: null }
    } catch (err: any) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppStateContext.Provider
      value={{
        trips,
        userProfile,
        loading,
        error,
        fetchTrips,
        fetchUserProfile,
        createTrip,
        applyToTrip,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
