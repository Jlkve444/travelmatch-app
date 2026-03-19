'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Phone, 
  Video,
  MoreVertical,
  ChevronLeft,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Volume2,
  Play,
  Pause
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

// Mock chat data
const MOCK_CHAT_ROOM = {
  id: 'chat-1',
  name: 'Portugal Crew',
  type: 'group',
  trip: {
    title: '3 Wochen Remote Work in Lissabon',
    destination: 'Lissabon, Portugal',
  },
  participants: [
    { id: '1', name: 'Lena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', isOnline: true },
    { id: '2', name: 'Max', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', isOnline: true },
    { id: '3', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', isOnline: false },
  ],
}

const MOCK_MESSAGES = [
  {
    id: '1',
    sender_id: 'system',
    type: 'system',
    content: 'Max ist der Gruppe beigetreten',
    created_at: '2026-03-19T10:00:00Z',
  },
  {
    id: '2',
    sender_id: '2',
    type: 'text',
    content: 'Hey alle! Freut mich, dabei zu sein 🎉',
    created_at: '2026-03-19T10:05:00Z',
    read_by: ['1', '3'],
  },
  {
    id: '3',
    sender_id: '1',
    type: 'text',
    content: 'Willkommen Max! Hast du schon Erfahrung mit Remote Work in Portugal?',
    created_at: '2026-03-19T10:08:00Z',
    read_by: ['2'],
  },
  {
    id: '4',
    sender_id: '2',
    type: 'text',
    content: 'Ja, war letztes Jahr schon in Lissabon! Die Coworking Spaces sind super. Kann euch das Selina empfehlen.',
    created_at: '2026-03-19T10:12:00Z',
    read_by: ['1', '3'],
  },
  {
    id: '5',
    sender_id: '3',
    type: 'text',
    content: 'Cool, danke für den Tipp! Ich habe auch schon ein paar Airbnb-Optionen gefunden.',
    created_at: '2026-03-19T10:15:00Z',
    read_by: ['1', '2'],
  },
  {
    id: '6',
    sender_id: '1',
    type: 'poll',
    content: 'Unterkunft: Airbnb mit Pool oder lieber mitten in der Stadt?',
    metadata: {
      poll_id: 'poll-1',
      options: [
        { id: '1', label: '🏊 Mit Pool', votes: 2 },
        { id: '2', label: '🏙️ City Center', votes: 1 },
      ],
      total_votes: 3,
    },
    created_at: '2026-03-19T10:20:00Z',
    read_by: ['2', '3'],
  },
  {
    id: '7',
    sender_id: '2',
    type: 'voice',
    content: 'Voice message',
    metadata: {
      duration: 45,
      url: '#',
    },
    created_at: '2026-03-19T10:25:00Z',
    read_by: [],
  },
  {
    id: '8',
    sender_id: '1',
    type: 'text',
    content: 'Ich bin auch für Pool! Dann können wir morgens schon schwimmen gehen 🏊‍♀️',
    created_at: '2026-03-19T10:30:00Z',
    read_by: [],
  },
]

function formatMessageTime(dateString: string) {
  return format(new Date(dateString), 'HH:mm', { locale: de })
}

function isSameDay(date1: string, date2: string) {
  return format(new Date(date1), 'yyyy-MM-dd') === format(new Date(date2), 'yyyy-MM-dd')
}

export function ChatRoom() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTypingUsers(['Max'])
        setTimeout(() => setTypingUsers([]), 3000)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender_id: '1', // Current user
      type: 'text',
      content: newMessage,
      created_at: new Date().toISOString(),
      read_by: [],
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getSender = (senderId: string) => {
    if (senderId === 'system') return null
    if (senderId === '1') return { name: 'Du', avatar: '', isMe: true }
    return MOCK_CHAT_ROOM.participants.find(p => p.id === senderId)
  }

  const isConsecutive = (index: number) => {
    if (index === 0) return false
    return messages[index].sender_id === messages[index - 1].sender_id
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <header className="glass border-b border-soft-sand/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="relative">
              <div className="flex -space-x-2">
                {MOCK_CHAT_ROOM.participants.slice(0, 3).map((p) => (
                  <Avatar key={p.id} className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-moss-green rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">{MOCK_CHAT_ROOM.participants.length}</span>
              </div>
            </div>
            
            <div>
              <h2 className="font-bold text-deep-ocean">{MOCK_CHAT_ROOM.name}</h2>
              <p className="text-xs text-deep-ocean/50">
                {MOCK_CHAT_ROOM.trip.destination} • {MOCK_CHAT_ROOM.participants.filter(p => p.isOnline).length} online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const sender = getSender(message.sender_id)
            const showAvatar = !isConsecutive(index) && message.sender_id !== '1'
            const isMe = message.sender_id === '1'

            // Date separator
            const showDateSeparator = index === 0 || !isSameDay(message.created_at, messages[index - 1].created_at)

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-soft-sand/50 px-4 py-1.5 rounded-full text-xs text-deep-ocean/50">
                      {format(new Date(message.created_at), 'EEEE, d. MMMM', { locale: de })}
                    </div>
                  </div>
                )}

                {message.type === 'system' ? (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-deep-ocean/40">{message.content}</span>
                  </div>
                ) : (
                  <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                      {sender && !isMe && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={sender.avatar} />
                          <AvatarFallback>{sender.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender Name */}
                      {showAvatar && !isMe && sender && (
                        <span className="text-xs text-deep-ocean/50 ml-1 mb-1 block">{sender.name}</span>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2.5 ${
                          isMe
                            ? 'bg-sunset-coral text-white'
                            : 'bg-white shadow-sm'
                        }`}
                        style={{ borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px' }}
                      >
                        {message.type === 'text' && (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}

                        {message.type === 'poll' && message.metadata && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium mb-3">{message.content}</p>
                            {message.metadata?.options?.map((option: any) => (
                              <div key={option.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{option.label}</span>
                                  <span className="font-medium">{option.votes} Stimmen</span>
                                </div>
                                <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white/50 rounded-full"
                                    style={{ width: `${(option.votes / (message.metadata?.total_votes || 1)) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.type === 'voice' && message.metadata && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setPlayingVoice(playingVoice === message.id ? null : message.id)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isMe ? 'bg-white/20' : 'bg-sunset-coral/10'
                              }`}
                            >
                              {playingVoice === message.id ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5 ml-0.5" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-8 flex items-center gap-0.5">
                                  {Array.from({ length: 20 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 rounded-full ${isMe ? 'bg-white/50' : 'bg-sunset-coral/30'}`}
                                      style={{
                                        height: `${Math.random() * 20 + 8}px`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <span className="text-xs opacity-70">{message.metadata.duration}s</span>
                          </div>
                        )}
                      </div>

                      {/* Time & Read Status */}
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] text-deep-ocean/40">
                          {formatMessageTime(message.created_at)}
                        </span>
                        
                        {isMe && (
                          <span className="text-[10px] text-deep-ocean/40">
                            {message.read_by?.length > 0 ? (
                              <CheckCheck className="w-3 h-3 text-moss-green" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-deep-ocean/50">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-deep-ocean/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-deep-ocean/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-deep-ocean/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{typingUsers.join(', ')} schreibt...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="glass border-t border-soft-sand/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
            <Paperclip className="w-5 h-5 text-deep-ocean/50" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Nachricht schreiben..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 h-12 bg-white/70 backdrop-blur-sm border-soft-sand"
              style={{ borderRadius: '9999px' }}
            />
            
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="w-5 h-5 text-deep-ocean/40" />
            </button>
          </div>
          
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              className="h-12 w-12 rounded-full bg-sunset-coral hover:bg-sunset-coral/90 p-0 flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          ) : (
            <Button
              variant={isRecording ? 'default' : 'ghost'}
              onClick={() => setIsRecording(!isRecording)}
              className={`h-12 w-12 rounded-full p-0 flex-shrink-0 ${
                isRecording ? 'bg-sunset-coral text-white' : ''
              }`}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
