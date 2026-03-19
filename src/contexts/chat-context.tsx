'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from './auth-context'
import { RealtimeChannel } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: ReturnType<typeof createClient> | null = null
if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export type Message = {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    name: string
    avatar_url: string
  }
}

export type ChatRoom = {
  id: string
  name: string
  trip_id?: string
  created_at: string
  participant_count?: number
}

type ChatContextType = {
  rooms: ChatRoom[]
  currentRoom: ChatRoom | null
  messages: Message[]
  loading: boolean
  typingUsers: string[]
  sendMessage: (content: string) => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  leaveRoom: () => void
  fetchRooms: () => Promise<void>
  setTyping: (isTyping: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const { user } = useAuth()

  // Fetch chat rooms
  const fetchRooms = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setRooms(data || [])
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Join room and subscribe to messages
  const joinRoom = useCallback(async (roomId: string) => {
    if (!supabase || !user) return
    
    // Leave previous room
    if (channel) {
      channel.unsubscribe()
    }

    // Fetch room details
    const { data: roomData } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single()
    
    if (roomData) {
      setCurrentRoom(roomData)
    }

    // Fetch existing messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select(`
        *,
        user:user_id(name, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
    
    if (messagesData) {
      setMessages(messagesData)
    }

    // Subscribe to new messages
    const newChannel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message
          
          // Fetch user details for the new message
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('name, avatar_url')
            .eq('id', newMessage.user_id)
            .single()
          
          const messageWithUser = {
            ...newMessage,
            user: userData || { name: 'Unknown', avatar_url: '' }
          }
          
          setMessages((prev) => [...prev, messageWithUser])
        }
      )
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          const { user_id, is_typing } = payload.payload as { user_id: string; is_typing: boolean }
          setTypingUsers((prev) => {
            if (is_typing && !prev.includes(user_id)) {
              return [...prev, user_id]
            } else if (!is_typing && prev.includes(user_id)) {
              return prev.filter((id) => id !== user_id)
            }
            return prev
          })
        }
      )
      .subscribe()

    setChannel(newChannel)

    // Add user to room participants
    await supabase
      .from('chat_participants')
      .upsert({
        room_id: roomId,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      } as any, { onConflict: 'room_id,user_id' })

  }, [user, channel])

  // Leave room
  const leaveRoom = useCallback(() => {
    if (channel) {
      channel.unsubscribe()
      setChannel(null)
    }
    setCurrentRoom(null)
    setMessages([])
    setTypingUsers([])
  }, [channel])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!supabase || !user || !currentRoom) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content: content.trim(),
        } as any)

      if (error) throw error

      // Clear typing status
      channel?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user.id, is_typing: false },
      })
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }, [user, currentRoom, channel])

  // Set typing status
  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!channel || !user) return

    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: user.id, is_typing: isTyping },
    })
  }, [user, channel])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [channel])

  // Load rooms on mount
  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  return (
    <ChatContext.Provider
      value={{
        rooms,
        currentRoom,
        messages,
        loading,
        typingUsers,
        sendMessage,
        joinRoom,
        leaveRoom,
        fetchRooms,
        setTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
