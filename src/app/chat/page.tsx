'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Send, Users, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'

const COLORS = {
  dune: '#F7F5F0',
  softSand: '#EBE7DD',
  sunsetCoral: '#E86A53',
  deepOcean: '#1A2B3C',
  fog: '#7A8B99',
  sageGreen: '#6B8E6B',
}

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { rooms, currentRoom, messages, loading, joinRoom, leaveRoom, sendMessage, typingUsers } = useChat()
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return
    setIsSending(true)
    try {
      await sendMessage(messageInput)
      setMessageInput('')
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) return null

  // Room list view
  if (!currentRoom) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS.dune }}>
        <header className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: COLORS.dune }}>
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-2">
              <ArrowLeft className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
            </button>
            <h1 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
              Chat Rooms
            </h1>
          </div>
        </header>

        <main className="px-4 pb-24">
          <div className="max-w-lg mx-auto space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.sunsetCoral }} />
              </div>
            ) : rooms.length === 0 ? (
              <Card className="p-8 text-center" style={{ borderRadius: '24px' }}>
                <p style={{ color: COLORS.fog }}>No chat rooms available yet.</p>
                <Button
                  onClick={() => router.push('/create-trip')}
                  className="mt-4"
                  style={{ 
                    backgroundColor: COLORS.sunsetCoral,
                    borderRadius: '9999px',
                    color: 'white'
                  }}
                >
                  Create a Trip
                </Button>
              </Card>
            ) : (
              rooms.map((room) => (
                <Card
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      <Users className="w-6 h-6" style={{ color: COLORS.fog }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: COLORS.deepOcean }}>
                        {room.name}
                      </h3>
                      <p className="text-sm" style={{ color: COLORS.fog }}>
                        {room.participant_count || 0} participants
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    )
  }

  // Chat room view
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 px-4 py-3"
        style={{ 
          backgroundColor: 'rgba(247, 245, 240, 0.95)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={leaveRoom} className="p-2">
            <ArrowLeft className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold" style={{ color: COLORS.deepOcean }}>
              {currentRoom.name}
            </h1>
            <p className="text-xs" style={{ color: COLORS.fog }}>
              {typingUsers.length > 0 && `${typingUsers.length} typing...`}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: COLORS.fog }}>No messages yet.<br />Start the conversation! 🎉</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.user_id === user?.id
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.user?.avatar_url} />
                    <AvatarFallback 
                      className="text-xs"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      {message.user?.name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    <p className="text-xs mb-1" style={{ color: COLORS.fog }}>
                      {message.user?.name || 'Unknown'}
                    </p>
                    
                    <div
                      className="px-4 py-2 rounded-2xl"
                      style={{
                        backgroundColor: isOwn ? COLORS.sunsetCoral : 'white',
                        color: isOwn ? 'white' : COLORS.deepOcean,
                        borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                      }}
                    >
                      <p>{message.content}</p>
                    </div>
                    
                    <p className="text-xs mt-1" style={{ color: COLORS.fog }}>
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true,
                        locale: de 
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div 
        className="px-4 py-3"
        style={{ 
          backgroundColor: 'white',
          borderTop: `1px solid ${COLORS.softSand}`
        }}
      >
        <div className="max-w-lg mx-auto flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            style={{ borderRadius: '9999px' }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            style={{
              backgroundColor: COLORS.sunsetCoral,
              borderRadius: '9999px',
              color: 'white'
            }}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
