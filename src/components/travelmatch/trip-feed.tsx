'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Calendar, Users, Verified, Heart, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

// Mock data - would come from API
const MOCK_TRIPS = [
  {
    id: '1',
    title: '3 Wochen Remote Work in Lissabon',
    destination: { name: 'Lissabon, Portugal', country_code: 'PT' },
    start_date: '2026-09-12',
    end_date: '2026-10-03',
    max_participants: 5,
    current_participants: 3,
    budget_range: { min: 1200, max: 1800, currency: 'EUR' },
    trip_type: 'coworking',
    image: 'https://images.unsplash.com/photo-1555881400-74d7aca11d2a?w=800&q=80',
    creator: {
      name: 'Lena',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      verified: true,
      trust_score: 95,
    },
    tags: ['Remote Work', 'Co-Living', 'Beach'],
    match_score: 92,
  },
  {
    id: '2',
    title: 'Bali Yoga & Wellness Retreat',
    destination: { name: 'Canggu, Bali', country_code: 'ID' },
    start_date: '2026-10-05',
    end_date: '2026-10-19',
    max_participants: 4,
    current_participants: 2,
    budget_range: { min: 800, max: 1200, currency: 'USD' },
    trip_type: 'leisure',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    creator: {
      name: 'Max',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true,
      trust_score: 88,
    },
    tags: ['Yoga', 'Wellness', 'Nature'],
    match_score: 87,
  },
  {
    id: '3',
    title: 'Kapstadt Adventure & Safari',
    destination: { name: 'Kapstadt, Südafrika', country_code: 'ZA' },
    start_date: '2026-11-01',
    end_date: '2026-11-14',
    max_participants: 6,
    current_participants: 4,
    budget_range: { min: 1500, max: 2500, currency: 'USD' },
    trip_type: 'adventure',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    creator: {
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      verified: true,
      trust_score: 91,
    },
    tags: ['Adventure', 'Safari', 'Hiking'],
    match_score: 85,
  },
  {
    id: '4',
    title: 'Mexiko City Digital Nomad Month',
    destination: { name: 'Mexiko City, Mexiko', country_code: 'MX' },
    start_date: '2026-09-01',
    end_date: '2026-09-30',
    max_participants: 8,
    current_participants: 5,
    budget_range: { min: 600, max: 1000, currency: 'USD' },
    trip_type: 'coworking',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80',
    creator: {
      name: 'Tom',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      verified: true,
      trust_score: 82,
    },
    tags: ['Remote Work', 'City Life', 'Culture'],
    match_score: 78,
  },
  {
    id: '5',
    title: 'Griechische Inseln Sailing Trip',
    destination: { name: 'Santorini, Griechenland', country_code: 'GR' },
    start_date: '2026-08-15',
    end_date: '2026-08-25',
    max_participants: 6,
    current_participants: 3,
    budget_range: { min: 2000, max: 3500, currency: 'EUR' },
    trip_type: 'leisure',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=800&q=80',
    creator: {
      name: 'Anna',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      verified: true,
      trust_score: 96,
    },
    tags: ['Sailing', 'Luxury', 'Sunset'],
    match_score: 94,
  },
  {
    id: '6',
    title: 'Japan Herbstlaub & Kultur',
    destination: { name: 'Kyoto, Japan', country_code: 'JP' },
    start_date: '2026-11-10',
    end_date: '2026-11-24',
    max_participants: 4,
    current_participants: 2,
    budget_range: { min: 2500, max: 4000, currency: 'EUR' },
    trip_type: 'mixed',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    creator: {
      name: 'David',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
      verified: true,
      trust_score: 89,
    },
    tags: ['Culture', 'Nature', 'Photography'],
    match_score: 81,
  },
]

const COUNTRY_FLAGS: Record<string, string> = {
  PT: '🇵🇹',
  ID: '🇮🇩',
  ZA: '🇿🇦',
  MX: '🇲🇽',
  GR: '🇬🇷',
  JP: '🇯🇵',
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${format(startDate, "d. MMM", { locale: de })} - ${format(endDate, "d. MMM", { locale: de })}`
}

function getMatchScoreColor(score: number) {
  if (score >= 90) return 'bg-moss-green text-white'
  if (score >= 75) return 'bg-amber text-white'
  return 'bg-sunset-coral text-white'
}

export function TripFeed() {
  const [searchQuery, setSearchQuery] = useState('')
  const [likedTrips, setLikedTrips] = useState<Set<string>>(new Set())

  const toggleLike = (tripId: string) => {
    setLikedTrips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tripId)) {
        newSet.delete(tripId)
      } else {
        newSet.add(tripId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-ocean/40" />
          <Input
            placeholder="Ziele, Reisearten oder Interessen suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white/70 backdrop-blur-sm border-soft-sand"
            style={{ borderRadius: '9999px' }}
          />
        </div>
        <Button
          variant="outline"
          className="h-12 px-6 border-soft-sand"
          style={{ borderRadius: '9999px' }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {['🇵🇹 Portugal', '🏖️ Beach', '💻 Remote Work', '✅ Verifiziert'].map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className="cursor-pointer hover:bg-sunset-coral/10 transition-colors"
            style={{ borderRadius: '9999px' }}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TRIPS.map((trip, index) => {
          const isHero = index === 0
          const isLiked = likedTrips.has(trip.id)

          return (
            <Card
              key={trip.id}
              className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isHero ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
              style={{ borderRadius: '24px' }}
            >
              <div className="relative h-full">
                {/* Image */}
                <div className={`relative overflow-hidden ${isHero ? 'h-72 lg:h-96' : 'h-48'}`}>
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(trip.id)
                    }}
                    className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked ? 'fill-sunset-coral text-sunset-coral' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Match Score Badge */}
                  <div className={`absolute ${isHero ? 'top-4 left-4' : 'top-3 left-3'}`}>
                    <div className={`${getMatchScoreColor(trip.match_score)} px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg`}>
                      {trip.match_score}% Match
                    </div>
                  </div>

                  {/* Floating Pills */}
                  <div className={`absolute ${isHero ? 'bottom-4 left-4 right-4' : 'bottom-3 left-3 right-3'} flex flex-wrap gap-2`}>
                    <Badge
                      className="bg-white/90 text-deep-ocean backdrop-blur-sm border-0 font-medium"
                      style={{ borderRadius: '9999px' }}
                    >
                      {COUNTRY_FLAGS[trip.destination.country_code] || '🌍'}{' '}
                      {trip.destination.name.split(',')[0]}
                    </Badge>
                    
                    <Badge
                      className="bg-white/90 text-deep-ocean backdrop-blur-sm border-0"
                      style={{ borderRadius: '9999px' }}
                    >
                      <Calendar className="w-3 h-3 mr-1 inline" />
                      {formatDateRange(trip.start_date, trip.end_date)}
                    </Badge>
                    
                    <Badge
                      className="bg-white/90 text-deep-ocean backdrop-blur-sm border-0"
                      style={{ borderRadius: '9999px' }}
                    >
                      <Users className="w-3 h-3 mr-1 inline" />
                      {trip.current_participants}/{trip.max_participants}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className={`${isHero ? 'p-6' : 'p-4'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-bold text-deep-ocean mb-2 ${isHero ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
                        {trip.title}
                      </h3>

                      {/* Creator */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="relative">
                          <Avatar className={`${isHero ? 'w-10 h-10' : 'w-8 h-8'} border-2 border-white shadow-md`}>
                            <AvatarImage src={trip.creator.avatar} />
                            <AvatarFallback className="bg-soft-sand text-deep-ocean text-sm">
                              {trip.creator.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {trip.creator.verified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                              <Verified className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep-ocean">{trip.creator.name}</p>
                          <p className="text-xs text-deep-ocean/50">Trust Score: {trip.creator.trust_score}/100</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {trip.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-soft-sand/50 text-deep-ocean/70 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full mt-4 bg-sunset-coral hover:bg-sunset-coral/90 text-white border-0 ${
                      isHero ? 'h-12 text-base' : 'h-10 text-sm'
                    }`}
                    style={{ borderRadius: '9999px' }}
                  >
                    Details ansehen
                  </Button>
                </CardContent>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button
          variant="outline"
          className="h-12 px-8 border-soft-sand"
          style={{ borderRadius: '9999px' }}
        >
          Mehr Trips laden
        </Button>
      </div>
    </div>
  )
}
