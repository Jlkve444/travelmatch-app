'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  SlidersHorizontal,
  Home,
  Search,
  Plus,
  MessageCircle,
  Briefcase,
  MapPin,
  Users,
  Zap,
  Heart
} from 'lucide-react'

// Brand Colors
const COLORS = {
  dune: '#F7F5F0',
  softSand: '#EBE7DD',
  sunsetCoral: '#E86A53',
  deepOcean: '#1A2B3C',
  fog: '#7A8B99',
  sageGreen: '#6B8E6B',
}

// Mock Trips Data
const MOCK_TRIPS = [
  {
    id: '1',
    title: 'Co-Working & Surfen im Oktober',
    location: { name: 'Lissabon', country: '🇵🇹', code: 'PT' },
    dates: '14. - 28. Okt',
    budget: 'ca. 800€ p.P.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?w=800&q=80',
    matchScore: 94,
    crew: [
      { id: '1', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { id: '2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
    ],
    spotsAvailable: 2,
    category: 'Remote Work',
  },
  {
    id: '2',
    title: 'Bali Digital Nomad Village',
    location: { name: 'Canggu', country: '🇮🇩', code: 'ID' },
    dates: '1. - 30. Nov',
    budget: 'ca. 1.200€ p.P.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    matchScore: 87,
    crew: [
      { id: '4', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
      { id: '5', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
    ],
    spotsAvailable: 3,
    category: 'Remote Work',
  },
  {
    id: '3',
    title: 'Roadtrip durch Portugal',
    location: { name: 'Porto → Lissabon', country: '🇵🇹', code: 'PT' },
    dates: '5. - 15. Sep',
    budget: 'ca. 600€ p.P.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?w=800&q=80',
    matchScore: 78,
    crew: [
      { id: '6', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
    ],
    spotsAvailable: 4,
    category: 'Roadtrips',
  },
  {
    id: '4',
    title: 'Cape Town Adventure',
    location: { name: 'Kapstadt', country: '🇿🇦', code: 'ZA' },
    dates: '10. - 24. Dez',
    budget: 'ca. 1.500€ p.P.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    matchScore: 91,
    crew: [
      { id: '7', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
      { id: '8', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
      { id: '9', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80' },
    ],
    spotsAvailable: 1,
    category: 'Abenteuer',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'Alle', active: true },
  { id: 'remote', label: 'Remote Work', active: false },
  { id: 'adventure', label: 'Abenteuer', active: false },
  { id: 'roadtrip', label: 'Roadtrips', active: false },
  { id: 'budget', label: 'Low Budget', active: false },
  { id: 'luxury', label: 'Luxury', active: false },
]

function TripCard({ trip }: { trip: typeof MOCK_TRIPS[0] }) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${trip.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top Left - Location Tag (Glassmorphism) */}
      <div className="absolute top-4 left-4">
        <div 
          className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <span className="text-lg">{trip.location.country}</span>
          <span className="text-white font-medium text-sm">{trip.location.name}</span>
        </div>
      </div>

      {/* Top Right - Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsLiked(!isLiked)
        }}
        className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors"
        style={{ backgroundColor: isLiked ? COLORS.sunsetCoral : 'rgba(255,255,255,0.2)' }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${isLiked ? 'text-white fill-white' : 'text-white'}`} 
        />
      </button>

      {/* Match Badge */}
      <div className="absolute top-16 left-4">
        <div 
          className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
          style={{ backgroundColor: COLORS.sageGreen }}
        >
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm">{trip.matchScore}% Vibe Match</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
          {trip.title}
        </h2>

        {/* Meta Info */}
        <p className="text-white/80 text-sm mb-3">
          {trip.dates} • {trip.budget}
        </p>

        {/* Crew Avatars + Available Spots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {trip.crew.map((member, i) => (
                <Avatar 
                  key={member.id} 
                  className="w-8 h-8 border-2 border-white"
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              ))}
            </div>
            
            {trip.spotsAvailable > 0 && (
              <div 
                className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white"
                style={{ backgroundColor: COLORS.sunsetCoral }}
              >
                +{trip.spotsAvailable}
              </div>
            )}
          </div>

          <Badge 
            className="text-white/90 border-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            {trip.category}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

export function NomadSyncDiscover() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          {/* User Avatar with Gold Ring */}
          <button className="relative">
            <div 
              className="w-12 h-12 rounded-full p-0.5"
              style={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              }}
            >
              <Avatar className="w-full h-full border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            </div>
            <div 
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: COLORS.sageGreen }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </button>

          {/* Logo */}
          <h1 
            className="text-xl font-bold"
            style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
          >
            NomadSync
          </h1>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.softSand }}
            >
              <Bell className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
              <div 
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.sunsetCoral }}
              />
            </button>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.softSand }}
            >
              <SlidersHorizontal className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: activeCategory === cat.id ? COLORS.deepOcean : COLORS.softSand,
                color: activeCategory === cat.id ? 'white' : COLORS.deepOcean,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Feed */}
      <main className="px-4 space-y-4">
        {MOCK_TRIPS.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </main>

      {/* Floating Bottom Navigation */}
      <nav 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div 
          className="flex items-center gap-2 px-2 py-2 rounded-full backdrop-blur-lg"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: activeTab === 'home' ? COLORS.sunsetCoral : 'transparent',
            }}
          >
            <Home 
              className="w-5 h-5" 
              style={{ color: activeTab === 'home' ? 'white' : COLORS.deepOcean }}
            />
          </button>

          {/* Search */}
          <button
            onClick={() => setActiveTab('search')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: activeTab === 'search' ? COLORS.sunsetCoral : 'transparent',
            }}
          >
            <Search 
              className="w-5 h-5" 
              style={{ color: activeTab === 'search' ? 'white' : COLORS.deepOcean }}
            />
          </button>

          {/* Create Trip (Big Center Button) */}
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center -mt-4 shadow-lg"
            style={{ 
              backgroundColor: COLORS.sunsetCoral,
              boxShadow: `0 8px 30px ${COLORS.sunsetCoral}60`,
            }}
          >
            <Plus className="w-7 h-7 text-white" />
          </button>

          {/* Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative"
            style={{
              backgroundColor: activeTab === 'messages' ? COLORS.sunsetCoral : 'transparent',
            }}
          >
            <MessageCircle 
              className="w-5 h-5" 
              style={{ color: activeTab === 'messages' ? 'white' : COLORS.deepOcean }}
            />
            <div 
              className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ backgroundColor: COLORS.sunsetCoral }}
            />
          </button>

          {/* My Trips */}
          <button
            onClick={() => setActiveTab('trips')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: activeTab === 'trips' ? COLORS.sunsetCoral : 'transparent',
            }}
          >
            <Briefcase 
              className="w-5 h-5" 
              style={{ color: activeTab === 'trips' ? 'white' : COLORS.deepOcean }}
            />
          </button>
        </div>
      </nav>
    </div>
  )
}
