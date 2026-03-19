// React Hooks for TravelMatch API
import { useState, useEffect, useCallback } from 'react'
import { 
  tripsApi, 
  applicationsApi, 
  usersApi, 
  chatApi, 
  reviewsApi,
  realtimeApi,
  authApi 
} from './api-integration'
import { supabase } from './supabase/client'

// ============================================
// TRIPS HOOKS
// ============================================
export function useTrips(filters?: Parameters<typeof tripsApi.getTrips>[0]) {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        const data = await tripsApi.getTrips(filters)
        setTrips(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [JSON.stringify(filters)])

  return { trips, loading, error, refetch: () => tripsApi.getTrips(filters) }
}

export function useTrip(id: string) {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchTrip = async () => {
      try {
        setLoading(true)
        const data = await tripsApi.getTrip(id)
        setTrip(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [id])

  return { trip, loading, error, refetch: () => tripsApi.getTrip(id) }
}

// ============================================
// APPLICATIONS HOOKS
// ============================================
export function useApplications(tripId: string) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tripId) return

    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.getApplications(tripId)
        setApplications(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()

    // Subscribe to realtime updates
    const subscription = realtimeApi.subscribeToApplications(tripId, (newApplication) => {
      setApplications(prev => {
        const exists = prev.find(a => a.id === newApplication.id)
        if (exists) {
          return prev.map(a => a.id === newApplication.id ? newApplication : a)
        }
        return [newApplication, ...prev]
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [tripId])

  return { applications, loading, error }
}

export function useMyApplications() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.getMyApplications()
        setApplications(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  return { applications, loading, error }
}

// ============================================
// USER HOOKS
// ============================================
export function useCurrentUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const data = await usersApi.getCurrentUser()
        setUser(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}

export function useUser(userId: string) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      try {
        setLoading(true)
        const data = await usersApi.getUser(userId)
        setUser(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, loading, error }
}

// ============================================
// CHAT HOOKS
// ============================================
export function useChatRooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const data = await chatApi.getChatRooms()
        setRooms(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return { rooms, loading, error }
}

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!roomId) return

    const fetchMessages = async () => {
      try {
        setLoading(true)
        const data = await chatApi.getMessages(roomId)
        setMessages(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to new messages
    const subscription = realtimeApi.subscribeToMessages(roomId, (newMessage) => {
      setMessages(prev => [...prev, newMessage])
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId])

  const sendMessage = useCallback(async (content: string, type: string = 'text') => {
    const newMessage = await chatApi.sendMessage(roomId, content, type)
    return newMessage
  }, [roomId])

  return { messages, loading, error, sendMessage }
}

// ============================================
// REVIEWS HOOKS
// ============================================
export function useReviews(userId: string) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await reviewsApi.getUserReviews(userId)
        setReviews(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  return { reviews, loading, error }
}

// ============================================
// AUTH HOOKS
// ============================================
export function useAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await authApi.getSession()
      setSession(session)
      setLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    loading,
    isAuthenticated: !!session,
    signIn: authApi.signIn,
    signUp: authApi.signUp,
    signOut: authApi.signOut,
    signInWithOAuth: authApi.signInWithOAuth,
  }
}

// ============================================
// UTILITY HOOKS
// ============================================
export function useRealtimeTrips(callback: (trip: any) => void) {
  useEffect(() => {
    const subscription = realtimeApi.subscribeToTrips(callback)
    return () => subscription.unsubscribe()
  }, [callback])
}

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fn()
      return result
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, execute }
}
