import { createContext, useContext, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-context'
import { PostgrestError } from '@supabase/supabase-js'

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

type AppStateContextType = {
  trips: Trip[]
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  fetchTrips: () => Promise<void>
  fetchUserProfile: (userId: string) => Promise<void>
  createTrip: (trip: Omit<Trip, 'id' | 'created_at' | 'current_participants'>) => Promise<{ error: PostgrestError | null }>
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

  const createTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'current_participants'>) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('trips')
        .insert([{ ...tripData, current_participants: 1 }])
      
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
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('trip_applications')
        .insert([{
          trip_id: tripId,
          user_id: user?.id,
          message,
          status: 'pending',
        }])
      
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
