'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useAppState } from '@/contexts/app-state-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MapPin, Calendar, Users, Verified, Heart, Plus, Loader2,
  Compass, User, MessageSquare, LogOut 
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

const COLORS = {
  dune: '#F7F5F0',
  softSand: '#EBE7DD',
  sunsetCoral: '#E86A53',
  deepOcean: '#1A2B3C',
  fog: '#7A8B99',
  sageGreen: '#6B8E6B',
}

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { trips, loading: tripsLoading, error, fetchTrips } = useAppState()
  const [activeTab, setActiveTab] = useState('discover')

  useEffect(() => {
    fetchTrips()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.sunsetCoral }} />
      </div>
    )
  }

  // Show login redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center" style={{ borderRadius: '24px' }}>
          <h1 className="text-3xl font-bold mb-4" style={{ 
            color: COLORS.deepOcean, 
            fontFamily: 'Georgia, serif' 
          }}>
            NomadSync
          </h1>
          <p className="mb-6" style={{ color: COLORS.fog }}>
            Finde deine perfekte Reise-Crew
          </p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full"
            style={{ 
              backgroundColor: COLORS.sunsetCoral,
              borderRadius: '9999px',
              color: 'white'
            }}
          >
            Jetzt starten
          </Button>
        </Card>
      </div>
    )
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = parseISO(start)
    const endDate = parseISO(end)
    return `${format(startDate, 'd. MMM', { locale: de })} - ${format(endDate, 'd. MMM', { locale: de })}`
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        style={{ 
          backgroundColor: 'rgba(247, 245, 240, 0.9)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{ 
                backgroundColor: COLORS.sunsetCoral,
                borderRadius: '12px'
              }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span 
              className="font-semibold text-lg"
              style={{ color: COLORS.deepOcean }}
            >
              NomadSync
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5" style={{ color: COLORS.fog }} />
            </Button>
            <Avatar className="w-9 h-9 border-2" style={{ borderColor: COLORS.sunsetCoral }}>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback style={{ backgroundColor: COLORS.softSand }}>
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.deepOcean }}>
            Hey{user.user_metadata?.name ? ` ${user.user_metadata.name}` : ''}! 👋
          </h1>
          <p style={{ color: COLORS.fog }}>
            Bereit für dein nächstes Abenteuer?
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-4 rounded-2xl text-sm"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {error}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchTrips}
              className="ml-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Trips List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: COLORS.deepOcean }}>
              Entdecke Trips
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              style={{ color: COLORS.sunsetCoral }}
            >
              Alle anzeigen
            </Button>
          </div>

          {tripsLoading ? (
            // Loading skeletons
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4" style={{ borderRadius: '20px' }}>
                  <Skeleton className="h-48 w-full rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </>
          ) : trips.length === 0 ? (
            // Empty state
            <Card 
              className="p-8 text-center"
              style={{ borderRadius: '20px', backgroundColor: 'white' }}
            >
              <Compass className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.fog }} />
              <h3 className="font-semibold mb-2" style={{ color: COLORS.deepOcean }}>
                Noch keine Trips
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.fog }}>
                Sei der Erste und erstelle einen Trip!
              </p>
              <Button
                style={{ 
                  backgroundColor: COLORS.sunsetCoral,
                  borderRadius: '9999px',
                  color: 'white'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Trip erstellen
              </Button>
            </Card>
          ) : (
            // Trips list
            trips.map((trip) => (
              <Card
                key={trip.id}
                className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ borderRadius: '20px', border: 'none' }}
              >
                <div className="relative h-48">
                  <img
                    src={trip.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: 'linear-gradient(to top, rgba(26,43,60,0.8), transparent)' 
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge 
                      className="text-xs font-medium"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: COLORS.deepOcean,
                        borderRadius: '999px'
                      }}
                    >
                      {trip.country_code === 'PT' && '🇵🇹'}
                      {trip.country_code === 'ID' && '🇮🇩'}
                      {trip.country_code === 'ZA' && '🇿🇦'}
                      {!['PT', 'ID', 'ZA'].includes(trip.country_code) && '🌍'}
                      {' '}
                      {trip.destination}
                    </Badge>
                  </div>

                  {/* Creator Avatar */}
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={trip.creator?.avatar_url} />
                        <AvatarFallback style={{ backgroundColor: COLORS.softSand }}>
                          {trip.creator?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {trip.creator?.verified && (
                        <div 
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: '#FFD700',
                            border: '2px solid white'
                          }}
                        >
                          <Verified className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{trip.current_participants}/{trip.max_participants}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {trip.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 px-4 py-3"
        style={{ 
          backgroundColor: 'rgba(247, 245, 240, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: `1px solid ${COLORS.softSand}`
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {[
            { id: 'discover', icon: Compass, label: 'Entdecken' },
            { id: 'trips', icon: MapPin, label: 'Meine Trips' },
            { id: 'messages', icon: MessageSquare, label: 'Nachrichten' },
            { id: 'profile', icon: User, label: 'Profil' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-1 py-2 px-4"
            >
              <Icon 
                className="w-6 h-6"
                style={{ 
                  color: activeTab === id ? COLORS.sunsetCoral : COLORS.fog 
                }}
              />
              <span 
                className="text-xs"
                style={{ 
                  color: activeTab === id ? COLORS.sunsetCoral : COLORS.fog,
                  fontWeight: activeTab === id ? 600 : 400
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
