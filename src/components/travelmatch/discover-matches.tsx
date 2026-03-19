'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { MatchCard, MatchCardCompact } from './match-card'
import { 
  Search, 
  Filter, 
  MapPin, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react'

// Mock matches data
const MOCK_MATCHES = [
  {
    userId: 'user-1',
    matchScore: 96,
    compatibilityBreakdown: {
      vibeSimilarity: 98,
      travelStyle: 95,
      schedule: 100,
      activity: 90,
      social: 95,
    },
    reasons: [
      'Eure Reisevibes sind sehr ähnlich',
      'Gemeinsame Interessen: Photography, Hiking',
      'Ihr beide seht früh auf 🌅',
    ],
    user: {
      id: 'user-1',
      name: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      age: 28,
      location: 'Berlin, DE',
      bio: 'Digital nomad & photographer. Love early mornings, coffee, and mountain hikes.',
      trustScore: 4.8,
      isVerified: true,
      languages: ['DE', 'EN', 'ES'],
      travelStyle: ['photography', 'hiking', 'slow-travel', 'foodie'],
    },
  },
  {
    userId: 'user-2',
    matchScore: 87,
    compatibilityBreakdown: {
      vibeSimilarity: 85,
      travelStyle: 90,
      schedule: 80,
      activity: 95,
      social: 90,
    },
    reasons: [
      'Beide Digital Nomads - perfekt für Coworking! 💻',
      'Gemeinsame Interessen: Coworking, Beach',
      'Komplementäre Reisestile',
    ],
    user: {
      id: 'user-2',
      name: 'Marcus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      age: 32,
      location: 'Amsterdam, NL',
      bio: 'Software engineer exploring the world. Always looking for good wifi and better coffee.',
      trustScore: 4.9,
      isVerified: true,
      languages: ['EN', 'NL'],
      travelStyle: ['coworking', 'beach', 'digital-nomad', 'foodie'],
    },
  },
  {
    userId: 'user-3',
    matchScore: 82,
    compatibilityBreakdown: {
      vibeSimilarity: 80,
      travelStyle: 85,
      schedule: 90,
      activity: 80,
      social: 85,
    },
    reasons: [
      'Gleicher Aktivitätslevel',
      'Sprachen gemeinsam: EN',
      'Beide mögen Abenteuer',
    ],
    user: {
      id: 'user-3',
      name: 'Emma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      age: 26,
      location: 'London, UK',
      bio: 'Adventure seeker and yoga instructor. Looking for mindful travel companions.',
      trustScore: 4.7,
      isVerified: false,
      languages: ['EN'],
      travelStyle: ['yoga', 'wellness', 'adventure', 'nature'],
    },
  },
  {
    userId: 'user-4',
    matchScore: 78,
    compatibilityBreakdown: {
      vibeSimilarity: 75,
      travelStyle: 80,
      schedule: 85,
      activity: 75,
      social: 80,
    },
    reasons: [
      'Komplementäre Reisestile',
      'Beide mögen Food',
    ],
    user: {
      id: 'user-4',
      name: 'Lucas',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      age: 30,
      location: 'Paris, FR',
      bio: 'Chef turned traveler. Exploring culinary traditions around the world.',
      trustScore: 4.6,
      isVerified: true,
      languages: ['FR', 'EN', 'IT'],
      travelStyle: ['foodie', 'culinary', 'culture', 'wine'],
    },
  },
  {
    userId: 'user-5',
    matchScore: 71,
    compatibilityBreakdown: {
      vibeSimilarity: 70,
      travelStyle: 75,
      schedule: 70,
      activity: 70,
      social: 75,
    },
    reasons: [
      'Gemeinsame Interessen: Culture',
    ],
    user: {
      id: 'user-5',
      name: 'Anna',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
      age: 29,
      location: 'Vienna, AT',
      bio: 'Art historian and museum enthusiast. Love cities with rich cultural heritage.',
      trustScore: 4.8,
      isVerified: true,
      languages: ['DE', 'EN'],
      travelStyle: ['culture', 'museums', 'history', 'city'],
    },
  },
]

export function DiscoverMatches() {
  const [matches, setMatches] = useState(MOCK_MATCHES)
  const [filteredMatches, setFilteredMatches] = useState(MOCK_MATCHES)
  const [searchQuery, setSearchQuery] = useState('')
  const [minScore, setMinScore] = useState(60)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<typeof MOCK_MATCHES[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter matches
  useEffect(() => {
    let filtered = matches

    // Filter by minimum score
    filtered = filtered.filter(m => m.matchScore >= minScore)

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.user.name.toLowerCase().includes(query) ||
        m.user.location.toLowerCase().includes(query) ||
        m.user.travelStyle.some(t => t.toLowerCase().includes(query))
      )
    }

    setFilteredMatches(filtered)
  }, [matches, minScore, searchQuery])

  const handleConnect = (userId: string) => {
    console.log('Connect with:', userId)
    // TODO: Implement connect logic
  }

  const handleMessage = (userId: string) => {
    console.log('Message:', userId)
    // TODO: Implement message logic
  }

  const handleDecline = (userId: string) => {
    setMatches(matches.filter(m => m.userId !== userId))
  }

  // Calculate stats
  const perfectMatches = matches.filter(m => m.matchScore >= 90).length
  const greatMatches = matches.filter(m => m.matchScore >= 75 && m.matchScore < 90).length
  const avgScore = Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-ocean flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sunset-coral" />
            Deine Matches
          </h1>
          <p className="text-deep-ocean/60">
            {matches.length} potenzielle Reisepartner gefunden
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-moss-green/10 text-moss-green border-0 px-3 py-1">
            ⭐ Durchschnitt: {avgScore}%
          </Badge>
          <Badge className="bg-sunset-coral/10 text-sunset-coral border-0 px-3 py-1">
            🔥 {perfectMatches} Perfect Matches
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card style={{ borderRadius: '20px' }}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-moss-green">{perfectMatches}</p>
            <p className="text-sm text-deep-ocean/60">Perfect Matches</p>
          </CardContent>
        </Card>
        <Card style={{ borderRadius: '20px' }}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber">{greatMatches}</p>
            <p className="text-sm text-deep-ocean/60">Great Matches</p>
          </CardContent>
        </Card>
        <Card style={{ borderRadius: '20px' }}>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-deep-ocean">{matches.length}</p>
            <p className="text-sm text-deep-ocean/60">Gesamt</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card style={{ borderRadius: '20px' }}>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-ocean/40" />
              <Input
                placeholder="Suche nach Name, Ort oder Interessen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 ${showFilters ? 'bg-sunset-coral/10 border-sunset-coral' : ''}`}
              style={{ borderRadius: '12px' }}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-soft-sand space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-deep-ocean">
                    Mindest-Match-Score
                  </label>
                  <span className="text-sm font-bold text-sunset-coral">{minScore}%</span>
                </div>
                <Slider
                  value={[minScore]}
                  onValueChange={(value) => setMinScore(Array.isArray(value) ? value[0] : value)}
                  min={40}
                  max={95}
                  step={5}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {['photography', 'hiking', 'coworking', 'foodie', 'beach'].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-sunset-coral/10 hover:border-sunset-coral"
                    style={{ borderRadius: '9999px' }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-deep-ocean/60">
            {filteredMatches.length} von {matches.length} Matches angezeigt
          </p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-sunset-coral' : ''}
              style={{ borderRadius: '8px' }}
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-sunset-coral' : ''}
              style={{ borderRadius: '8px' }}
            >
              Liste
            </Button>
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <Card style={{ borderRadius: '20px' }}>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-soft-sand flex items-center justify-center">
                <Search className="w-8 h-8 text-deep-ocean/40" />
              </div>
              <h3 className="text-lg font-semibold text-deep-ocean mb-2">Keine Matches gefunden</h3>
              <p className="text-deep-ocean/60">Versuche die Filter anzupassen</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.userId}
                matchScore={match.matchScore}
                user={match.user}
                compatibilityBreakdown={match.compatibilityBreakdown}
                reasons={match.reasons}
                onAccept={() => handleConnect(match.userId)}
                onDecline={() => handleDecline(match.userId)}
                onMessage={() => handleMessage(match.userId)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <MatchCardCompact
                key={match.userId}
                matchScore={match.matchScore}
                user={match.user}
                onClick={() => setSelectedMatch(match)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected Match Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <MatchCard
              matchScore={selectedMatch.matchScore}
              user={selectedMatch.user}
              compatibilityBreakdown={selectedMatch.compatibilityBreakdown}
              reasons={selectedMatch.reasons}
              onAccept={() => handleConnect(selectedMatch.userId)}
              onDecline={() => {
                handleDecline(selectedMatch.userId)
                setSelectedMatch(null)
              }}
              onMessage={() => handleMessage(selectedMatch.userId)}
            />
            <Button
              variant="ghost"
              onClick={() => setSelectedMatch(null)}
              className="w-full mt-4 text-white hover:bg-white/20"
            >
              Schließen
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
