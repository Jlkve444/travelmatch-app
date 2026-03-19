'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft,
  MoreVertical,
  MapPin,
  Wallet,
  BarChart3,
  Calendar,
  Plus,
  Camera,
  Mic,
  Send,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Users,
  X,
  ChevronRight,
  Clock,
  ArrowRightLeft,
  Receipt,
  PlusCircle,
  MinusCircle
} from 'lucide-react'

// Brand Colors
const COLORS = {
  dune: '#F7F5F0',
  softSand: '#EBE7DD',
  sunsetCoral: '#E86A53',
  deepOcean: '#1A2B3C',
  fog: '#7A8B99',
  sageGreen: '#6B8E6B',
  amber: '#D4A373',
}

// Mock Data
const CREW_MEMBERS = [
  { id: '1', name: 'Finn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', isOnline: true },
  { id: '2', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', isOnline: true },
  { id: '3', name: 'Marc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', isOnline: false },
  { id: '4', name: 'Lena', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', isOnline: true },
]

const MESSAGES = [
  {
    id: '1',
    type: 'system',
    content: 'Lena hat eine neue Unterkunft zu den Bookmarks hinzugefügt',
    timestamp: '14:32',
  },
  {
    id: '2',
    senderId: '2',
    type: 'text',
    content: 'Hey Leute! Ich habe ein super Airbnb in Ericeira gefunden. Meerblick und Coworking Space direkt im Haus!',
    timestamp: '14:35',
    readBy: ['1', '3', '4'],
  },
  {
    id: '3',
    senderId: '1',
    type: 'text',
    content: 'Das sieht perfekt aus! Wie viel kostet es pro Nacht?',
    timestamp: '14:38',
    readBy: ['2', '3', '4'],
  },
  {
    id: '4',
    type: 'system',
    content: 'Max hat die Umfrage "Mietwagen oder Zug?" gestartet',
    timestamp: '14:40',
  },
  {
    id: '5',
    senderId: '3',
    type: 'poll',
    question: 'Mietwagen oder Zug?',
    options: [
      { label: '🚗 Mietwagen (flexibel)', votes: 2, voters: ['1', '3'] },
      { label: '🚂 Zug (entspannt)', votes: 1, voters: ['2'] },
    ],
    timestamp: '14:41',
  },
  {
    id: '6',
    senderId: '4',
    type: 'text',
    content: 'Ich bin für den Zug! Die Strecke Lissabon - Ericeira ist wunderschön.',
    timestamp: '14:45',
    readBy: ['1', '2', '3'],
  },
  {
    id: '7',
    senderId: '2',
    type: 'expense',
    description: 'Airbnb Anzahlung',
    amount: 450,
    currency: '€',
    paidBy: '2',
    splits: [
      { userId: '1', amount: 112.50 },
      { userId: '2', amount: 112.50 },
      { userId: '3', amount: 112.50 },
      { userId: '4', amount: 112.50 },
    ],
    timestamp: '15:02',
  },
]

const EXPENSES = [
  { id: '1', description: 'Airbnb Anzahlung', amount: 450, paidBy: 'Sarah', date: 'Heute' },
  { id: '2', description: 'Mietwagen', amount: 320, paidBy: 'Finn', date: 'Gestern' },
  { id: '3', description: 'Restaurant', amount: 180, paidBy: 'Marc', date: 'Gestern' },
]

const BALANCES = [
  { userId: '1', name: 'Finn', balance: 80 },
  { userId: '2', name: 'Sarah', balance: -120 },
  { userId: '3', name: 'Marc', balance: 45 },
  { userId: '4', name: 'Lena', balance: -5 },
]

export function NomadSyncCrewSpace() {
  const [activeTab, setActiveTab] = useState<'chats' | 'crew'>('crew')
  const [activePlugin, setActivePlugin] = useState<null | 'itinerary' | 'expenses' | 'polls'>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(MESSAGES)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: '1',
      type: 'text',
      content: message,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      readBy: [],
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
  }

  const currentUser = CREW_MEMBERS[0]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.softSand }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
          </button>

          <div className="text-center">
            <h1 className="font-bold" style={{ color: COLORS.deepOcean }}>
              Portugal Surf Crew 🏄‍♂️
            </h1>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="flex -space-x-2">
                {CREW_MEMBERS.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="w-6 h-6 rounded-full border-2 border-white relative"
                  >
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
                        style={{ backgroundColor: COLORS.sageGreen }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs" style={{ color: COLORS.fog }}>
                +1 online
              </span>
            </div>
          </div>

          <button className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.softSand }}
          >
            <MoreVertical className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
          </button>
        </div>

        {/* Segmented Control */}
        <div className="flex p-1 rounded-2xl mb-4" style={{ backgroundColor: COLORS.softSand }}>
          <button
            onClick={() => setActiveTab('chats')}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === 'chats' ? 'white' : 'transparent',
              color: activeTab === 'chats' ? COLORS.deepOcean : COLORS.fog,
              boxShadow: activeTab === 'chats' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Chats
          </button>
          
          <button
            onClick={() => setActiveTab('crew')}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === 'crew' ? 'white' : 'transparent',
              color: activeTab === 'crew' ? COLORS.deepOcean : COLORS.fog,
              boxShadow: activeTab === 'crew' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Crew Spaces
          </button>
        </div>

        {/* Mini Apps / Plugins */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'itinerary', icon: Calendar, label: 'Itinerary', color: COLORS.amber },
            { id: 'expenses', icon: Wallet, label: 'Expenses', color: COLORS.sageGreen },
            { id: 'polls', icon: BarChart3, label: 'Polls', color: COLORS.sunsetCoral },
          ].map((plugin) => (
            <button
              key={plugin.id}
              onClick={() => setActivePlugin(plugin.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors"
              style={{
                backgroundColor: activePlugin === plugin.id ? plugin.color : 'white',
                color: activePlugin === plugin.id ? 'white' : COLORS.deepOcean,
              }}
            >
              <plugin.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{plugin.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div 
                    className="px-4 py-2 rounded-full text-xs"
                    style={{ backgroundColor: COLORS.softSand, color: COLORS.fog }}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            }

            if (msg.type === 'expense') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div 
                    className="p-4 rounded-2xl max-w-[80%]"
                    style={{ backgroundColor: 'white' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.sageGreen + '20' }}
                      >
                        <Receipt className="w-5 h-5" style={{ color: COLORS.sageGreen }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: COLORS.deepOcean }}>
                          {(msg as any).description}
                        </p>
                        <p className="text-2xl font-bold" style={{ color: COLORS.sageGreen }}>
                          {(msg as any).amount}{(msg as any).currency}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-sm" style={{ color: COLORS.fog }}>
                      Bezahlt von {CREW_MEMBERS.find(m => m.id === (msg as any).paidBy)?.name}
                    </div>
                  </div>
                </div>
              )
            }

            if (msg.type === 'poll') {
              const totalVotes = (msg as any).options.reduce((sum: number, opt: any) => sum + opt.votes, 0)
              return (
                <div key={msg.id} className="flex justify-center">
                  <div 
                    className="p-4 rounded-2xl max-w-[80%] w-full"
                    style={{ backgroundColor: 'white' }}
                  >
                    <p className="font-medium mb-3" style={{ color: COLORS.deepOcean }}>
                      {(msg as any).question}
                    </p>
                    
                    <div className="space-y-2">
                      {(msg as any).options.map((option: any, i: number) => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                        return (
                          <button
                            key={i}
                            className="w-full relative h-10 rounded-xl overflow-hidden"
                            style={{ backgroundColor: COLORS.softSand }}
                          >
                            <div 
                              className="absolute inset-y-0 left-0 transition-all"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS.sunsetCoral + '30',
                              }}
                            />
                            
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-sm font-medium" style={{ color: COLORS.deepOcean }}>
                                {option.label}
                              </span>                              
                              <span className="text-sm" style={{ color: COLORS.fog }}>
                                {option.votes}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            }

            const isMe = msg.senderId === currentUser.id
            const sender = CREW_MEMBERS.find(m => m.id === msg.senderId)

            return (
              <div 
                key={msg.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={sender?.avatar} />
                      <AvatarFallback>{sender?.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    {!isMe && (
                      <p className="text-xs mb-1 ml-1" style={{ color: COLORS.fog }}>
                        {sender?.name}
                      </p>
                    )}
                    
                    <div 
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        backgroundColor: isMe ? COLORS.deepOcean : 'white',
                        color: isMe ? 'white' : COLORS.deepOcean,
                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-xs" style={{ color: COLORS.fog }}>
                        {msg.timestamp}
                      </span>                      
                      
                      {isMe && (
                        <>
                          {(msg as any).readBy?.length > 0 ? (
                            <CheckCheck className="w-3 h-3" style={{ color: COLORS.sageGreen }} />
                          ) : (
                            <Check className="w-3 h-3" style={{ color: COLORS.fog }} />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Plugin Overlay (Expenses) */}
      <AnimatePresence>
        {activePlugin === 'expenses' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePlugin(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: COLORS.dune, maxHeight: '80vh' }}
            >
              <div className="p-4 border-b flex items-center justify-between"
                style={{ borderColor: COLORS.softSand }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.sageGreen + '20' }}
                  >
                    <Wallet className="w-5 h-5" style={{ color: COLORS.sageGreen }} />
                  </div>
                  
                  <div>
                    <h2 className="font-bold" style={{ color: COLORS.deepOcean }}>
                      Expenses
                    </h2>
                    <p className="text-sm" style={{ color: COLORS.fog }}>
                      Wer schuldet wem was?
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActivePlugin(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.softSand }}
                >
                  <X className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
                </button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                {/* Balances */}
                <div className="p-4 rounded-2xl" style={{ backgroundColor: 'white' }}>
                  <h3 className="font-semibold mb-3" style={{ color: COLORS.deepOcean }}>
                    Bilanz
                  </h3>
                  
                  <div className="space-y-2">
                    {BALANCES.map((balance) => (
                      <div key={balance.userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={CREW_MEMBERS.find(m => m.id === balance.userId)?.avatar} />
                            <AvatarFallback>{balance.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <span className="text-sm" style={{ color: COLORS.deepOcean }}>
                            {balance.name}
                          </span>
                        </div>
                        
                        <span 
                          className="font-bold"
                          style={{ 
                            color: balance.balance > 0 ? COLORS.sageGreen : 
                                   balance.balance < 0 ? COLORS.sunsetCoral : COLORS.fog 
                          }}
                        >
                          {balance.balance > 0 ? '+' : ''}{balance.balance}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense List */}
                <div className="space-y-2">
                  <h3 className="font-semibold" style={{ color: COLORS.deepOcean }}>
                    Ausgaben
                  </h3>
                  
                  {EXPENSES.map((expense) => (
                    <div 
                      key={expense.id}
                      className="p-3 rounded-2xl flex items-center justify-between"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: COLORS.softSand }}
                        >
                          <Receipt className="w-5 h-5" style={{ color: COLORS.fog }} />
                        </div>
                        
                        <div>
                          <p className="font-medium text-sm" style={{ color: COLORS.deepOcean }}>
                            {expense.description}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.fog }}>
                            {expense.paidBy} • {expense.date}
                          </p>
                        </div>
                      </div>
                      
                      <span className="font-bold" style={{ color: COLORS.deepOcean }}>
                        {expense.amount}€
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-12 rounded-xl"
                  style={{ backgroundColor: COLORS.sageGreen, color: 'white' }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ausgabe hinzufügen
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Input Area */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.softSand, backgroundColor: COLORS.dune }}>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowActionSheet(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORS.sunsetCoral }}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schreibe eine Nachricht..."
              className="pr-12 h-12 rounded-full border-0"
              style={{ backgroundColor: 'white' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
            />            
            
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.softSand }}
            >
              <Mic className="w-4 h-4" style={{ color: COLORS.deepOcean }} />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ 
              backgroundColor: message.trim() ? COLORS.sunsetCoral : COLORS.softSand,
            }}
          >
            <Send className={`w-5 h-5 ${message.trim() ? 'text-white' : ''}`} 
              style={{ color: message.trim() ? 'white' : COLORS.fog }}
            />
          </button>
        </div>
      </div>

      {/* Action Sheet */}
      <AnimatePresence>
        {showActionSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActionSheet(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6"
              style={{ backgroundColor: COLORS.dune }}
            >
              <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: COLORS.softSand }} />

              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Camera, label: 'Foto', color: COLORS.sunsetCoral },
                  { icon: MapPin, label: 'Ort', color: COLORS.sageGreen },
                  { icon: BarChart3, label: 'Umfrage', color: COLORS.amber },
                  { icon: Wallet, label: 'Ausgabe', color: COLORS.deepOcean },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex flex-col items-center gap-2"
                    onClick={() => setShowActionSheet(false)}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: action.color + '20' }}
                    >
                      <action.icon className="w-7 h-7" style={{ color: action.color }} />
                    </div>
                    
                    <span className="text-sm" style={{ color: COLORS.deepOcean }}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowActionSheet(false)}
                className="w-full h-12 rounded-xl mt-6"
                style={{ backgroundColor: COLORS.softSand, color: COLORS.deepOcean }}
              >
                Abbrechen
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
