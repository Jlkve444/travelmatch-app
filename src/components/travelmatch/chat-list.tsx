'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MessageCircle, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

// Mock chat list data
const MOCK_CHATS = [
  {
    id: '1',
    name: 'Portugal Crew',
    type: 'group',
    avatar: null,
    participants: [
      { name: 'Lena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { name: 'Max', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
      { name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
    ],
    last_message: {
      content: 'Ich bin auch für Pool! 🏊‍♀️',
      sender: 'Du',
      timestamp: '2026-03-19T10:30:00Z',
      unread: false,
    },
    unread_count: 0,
    is_active: true,
  },
  {
    id: '2',
    name: 'Max',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    participants: [],
    last_message: {
      content: 'Super, danke für den Tipp mit dem Coworking Space!',
      sender: 'Max',
      timestamp: '2026-03-19T09:15:00Z',
      unread: true,
    },
    unread_count: 2,
    is_active: true,
  },
  {
    id: '3',
    name: 'Bali Yoga Group',
    type: 'group',
    avatar: null,
    participants: [
      { name: 'Anna', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
      { name: 'Tom', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    ],
    last_message: {
      content: 'Wann genau landet ihr in Denpasar?',
      sender: 'Anna',
      timestamp: '2026-03-18T18:45:00Z',
      unread: true,
    },
    unread_count: 5,
    is_active: false,
  },
  {
    id: '4',
    name: 'Sarah',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    participants: [],
    last_message: {
      content: 'Hast du schon das Airbnb gefunden, das ich geschickt habe?',
      sender: 'Sarah',
      timestamp: '2026-03-17T14:20:00Z',
      unread: false,
    },
    unread_count: 0,
    is_active: false,
  },
  {
    id: '5',
    name: 'Kapstadt Adventure',
    type: 'group',
    avatar: null,
    participants: [
      { name: 'David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
      { name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
    ],
    last_message: {
      content: 'Die Safari ist gebucht! 🦁',
      sender: 'David',
      timestamp: '2026-03-15T11:00:00Z',
      unread: false,
    },
    unread_count: 0,
    is_active: false,
  },
]

function formatLastMessageTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return format(date, 'HH:mm', { locale: de })
  }
  return format(date, 'EEE', { locale: de })
}

function truncateMessage(message: string, maxLength: number = 40) {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

export function ChatList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<string | null>('1')

  const filteredChats = MOCK_CHATS.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = MOCK_CHATS.reduce((sum, chat) => sum + chat.unread_count, 0)

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-soft-sand/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-deep-ocean">Nachrichten</h2>
          
          {totalUnread > 0 && (
            <Badge 
              className="bg-sunset-coral text-white"
              style={{ borderRadius: '9999px' }}
            >
              {totalUnread}
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-ocean/40" />
          <Input
            placeholder="Chats suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-white/70 border-soft-sand"
            style={{ borderRadius: '9999px' }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-deep-ocean/20" />
            <p className="text-deep-ocean/50">Keine Chats gefunden</p>
          </div>
        ) : (
          <div className="divide-y divide-soft-sand/50">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-white/50 transition-colors ${
                  selectedChat === chat.id ? 'bg-white/70' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {chat.type === 'group' ? (
                    <div className="flex -space-x-2">
                      {chat.participants.slice(0, 2).map((p, i) => (
                        <Avatar 
                          key={i} 
                          className={`w-12 h-12 border-2 border-white ${i === 0 ? 'z-10' : ''}`}
                        >
                          <AvatarImage src={p.avatar} />
                          <AvatarFallback>{p.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  ) : (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar || undefined} />
                      <AvatarFallback className="bg-soft-sand text-deep-ocean">
                        {chat.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {chat.is_active && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-moss-green rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-semibold truncate ${
                      chat.unread_count > 0 ? 'text-deep-ocean' : 'text-deep-ocean/80'
                    }`}>
                      {chat.name}
                    </h3>
                    
                    <span className="text-xs text-deep-ocean/40 flex-shrink-0">
                      {formatLastMessageTime(chat.last_message.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <p className={`text-sm truncate flex-1 ${
                      chat.unread_count > 0 
                        ? 'text-deep-ocean font-medium' 
                        : 'text-deep-ocean/50'
                    }`}>
                      {chat.last_message.sender !== chat.name && (
                        <span className="text-deep-ocean/50">Du: </span>
                      )}
                      {truncateMessage(chat.last_message.content)}
                    </p>

                    {chat.unread_count > 0 && (
                      <Badge 
                        className="bg-sunset-coral text-white text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5"
                        style={{ borderRadius: '9999px' }}
                      >
                        {chat.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
