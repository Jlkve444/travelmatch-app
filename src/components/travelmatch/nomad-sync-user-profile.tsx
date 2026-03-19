'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Settings,
  Star,
  Shield,
  Instagram,
  Linkedin,
  Music,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  ChevronRight,
  Quote
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
  gold: '#FFD700',
}

// Mock User Data
const USER = {
  id: 'user-1',
  name: 'Lena M.',
  age: 28,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  title: 'Digital Nomad & Coffee Addict',
  isVerified: true,
  verifiedDate: 'März 2026',
  trustScore: 4.98,
  reviewCount: 42,
  location: 'Berlin, DE',
  memberSince: '2024',
  vibeTags: [
    { emoji: '☕️', label: 'Early Bird', color: COLORS.amber },
    { emoji: '💻', label: 'Remote Worker', color: COLORS.sageGreen },
    { emoji: '🏕', label: 'Nature Lover', color: COLORS.sageGreen },
    { emoji: '🍷', label: 'Casual Drinks', color: COLORS.sunsetCoral },
    { emoji: '📸', label: 'Photographer', color: COLORS.amber },
    { emoji: '🧘‍♀️', label: 'Yoga', color: COLORS.sageGreen },
  ],
  socialLinks: [
    { platform: 'Instagram', handle: '@lena.travels', icon: Instagram, verified: true, color: '#E4405F' },
    { platform: 'LinkedIn', handle: 'Verifiziert', icon: Linkedin, verified: true, color: '#0A66C2' },
    { platform: 'Spotify', handle: 'Travel Playlist', icon: Music, verified: false, color: '#1DB954' },
  ],
  pastTrips: [
    { 
      id: '1', 
      title: 'Kapstadt', 
      date: 'Jan 2025', 
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&q=80',
      crew: 4,
    },
    { 
      id: '2', 
      title: 'Bali Co-Work', 
      date: 'Aug 2025', 
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80',
      crew: 6,
    },
    { 
      id: '3', 
      title: 'Lissabon', 
      date: 'Jun 2025', 
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?w=300&q=80',
      crew: 3,
    },
    { 
      id: '4', 
      title: 'Chiang Mai', 
      date: 'Nov 2024', 
      image: 'https://images.unsplash.com/photo-1598935898639-33d885d54861?w=300&q=80',
      crew: 5,
    },
  ],
  reviews: [
    {
      id: '1',
      author: {
        name: 'Sarah',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        trip: 'Kapstadt Jan 2025',
      },
      rating: 5,
      text: 'Lena ist die beste Co-Workerin. Hatten ein tolles Airbnb, sie ist super entspannt, respektiert aber auch Fokus-Zeiten. 10/10 würde wieder mit ihr reisen!',
      date: 'Feb 2025',
    },
    {
      id: '2',
      author: {
        name: 'Marc',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        trip: 'Bali Co-Work Aug 2025',
      },
      rating: 5,
      text: 'Perfekte Balance aus Arbeit und Spaß. Lena kennt die besten Spots für Coworking und hat uns tolle lokale Kontakte vermittelt.',
      date: 'Sep 2025',
    },
    {
      id: '3',
      author: {
        name: 'Emma',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        trip: 'Lissabon Jun 2025',
      },
      rating: 5,
      text: 'Wir haben uns sofort verstanden. Lena ist organisiert, kommunikativ und macht jeden Trip besser.',
      date: 'Jul 2025',
    },
  ],
}

// Star Rating Component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export function NomadSyncUserProfile() {
  const [activeTab, setActiveTab] = useState('trips')

  return (
    <div className="min-h-screen pb-6" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="px-4 pt-4 flex justify-end">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: COLORS.softSand }}
        >
          <Settings className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
        </button>
      </header>

      {/* Profile Header */}
      <div className="px-4 pb-6 text-center">
        {/* Avatar with Verification Badge */}
        <div className="relative inline-block mb-4">
          <div 
            className="w-32 h-32 mx-auto overflow-hidden"
            style={{ 
              borderRadius: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <img 
              src={USER.avatar}
              alt={USER.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Verification Badge */}
          <{USER.isVerified && (
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
              }}
            >
              <Shield className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">Verifiziert</span>
            </div>
          )}
        </div>

        {/* Name & Title */}
        <h1 
          className="text-3xl font-bold mb-1"
          style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
        >
          {USER.name}, {USER.age}
        </h1>

        <p className="text-base mb-4" style={{ color: COLORS.fog }}>
          {USER.title}
        </p>

        {/* Trust Score */}
        <div 
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full mx-auto"
          style={{ backgroundColor: 'white' }}
        >
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
              {USER.trustScore}
            </span>
          </div>
          
          <div className="w-px h-4" style={{ backgroundColor: COLORS.softSand }} />
          
          <span className="text-sm" style={{ color: COLORS.fog }}>
            ({USER.reviewCount} Reviews)
          </span>
        </div>

        {/* Location & Member Since */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm" style={{ color: COLORS.fog }}>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {USER.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Seit {USER.memberSince}
          </div>
        </div>
      </div>

      {/* Vibe Tags */}
      <div className="px-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {USER.vibeTags.map((tag, i) => (
            <Badge
              key={i}
              className="px-3 py-1.5 text-sm font-medium border-0"
              style={{ 
                backgroundColor: tag.color + '20',
                color: tag.color,
              }}
            >
              {tag.emoji} {tag.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="px-4 mb-6">
        <h3 
          className="text-sm font-semibold mb-3 text-center"
          style={{ color: COLORS.fog }}
        >
          Verifizierte Accounts
        </h3>

        <div className="flex justify-center gap-3">
          {USER.socialLinks.map((link, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-transform active:scale-95"
              style={{ backgroundColor: 'white' }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: link.color + '15' }}
              >
                <link.icon className="w-4 h-4" style={{ color: link.color }} />
              </div>
              
              <div className="text-left">
                <p className="text-xs font-medium" style={{ color: COLORS.deepOcean }}>
                  {link.platform}
                </p>
                <p className="text-xs" style={{ color: COLORS.fog }}>
                  {link.handle}
                </p>
              </div>

              {link.verified && (
                <CheckCircle2 className="w-4 h-4 ml-1" style={{ color: COLORS.sageGreen }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex p-1 rounded-2xl" style={{ backgroundColor: COLORS.softSand }}>
          {[
            { id: 'trips', label: 'Past Trips', count: USER.pastTrips.length },
            { id: 'reviews', label: 'Reviews', count: USER.reviewCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? COLORS.deepOcean : COLORS.fog,
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tab.label}
              <span 
                className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                style={{ 
                  backgroundColor: activeTab === tab.id ? COLORS.sunsetCoral : COLORS.fog + '30',
                  color: activeTab === tab.id ? 'white' : COLORS.fog,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'trips' && (
          <div className="space-y-3">
            {USER.pastTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-2xl flex items-center gap-4"
                style={{ backgroundColor: 'white' }}
              >
                <div 
                  className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                >
                  <img 
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: COLORS.deepOcean }}>
                    {trip.title}
                  </h4>
                  
                  <p className="text-sm" style={{ color: COLORS.fog }}>
                    {trip.date}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" style={{ color: COLORS.fog }} />
                    <span className="text-xs" style={{ color: COLORS.fog }}>
                      Crew von {trip.crew}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5" style={{ color: COLORS.fog }} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {USER.reviews.map((review) => (
              <Card 
                key={review.id}
                className="border-0 overflow-hidden"
                style={{ backgroundColor: 'white' }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.author.avatar} />
                      <AvatarFallback>{review.author.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm" style={{ color: COLORS.deepOcean }}>
                            {review.author.name}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.fog }}>
                            {review.author.trip}
                          </p>
                        </div>
                        
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-1 -left-1 w-6 h-6 opacity-10" style={{ color: COLORS.deepOcean }} />
                    
                    <p 
                      className="text-sm leading-relaxed pl-4"
                      style={{ color: COLORS.deepOcean }}
                    >
                      {review.text}
                    </p>
                  </div>

                  <p className="text-xs mt-3 text-right" style={{ color: COLORS.fog }}>
                    {review.date}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-2"
              style={{ borderColor: COLORS.softSand, color: COLORS.deepOcean }}
            >
              Alle {USER.reviewCount} Reviews anzeigen
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-4 mt-6">
        <Button
          className="w-full h-14 rounded-full text-base font-bold"
          style={{ 
            backgroundColor: COLORS.sunsetCoral,
            color: 'white',
            boxShadow: `0 10px 30px ${COLORS.sunsetCoral}50`,
          }}
        >
          Mit Lena connecten
        </Button>
      </div>
    </div>
  )
}
