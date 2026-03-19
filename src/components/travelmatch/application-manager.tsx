'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  User, 
  MessageCircle, 
  Mic, 
  X, 
  Check, 
  Clock,
  MapPin,
  Calendar,
  Users,
  Verified,
  Play,
  Pause
} from 'lucide-react'

// Mock application data
const MOCK_APPLICATIONS = [
  {
    id: '1',
    applicant: {
      name: 'Max',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      verified: true,
      trust_score: 88,
      bio: 'Digital Nomad aus Berlin. Liebe Yoga, gutes Essen und Sonnenuntergänge.',
      interests: ['Yoga', 'Kochen', 'Fotografie', 'Wandern'],
    },
    message: 'Hey! Ich bin Max, 29, und arbeite remote als Software Developer. Dein Trip klingt perfekt - ich war letztes Jahr schon in Lissabon und würde gerne zurückkommen. Ich bin ein Early Bird und liebe es, morgens schon an den Strand zu gehen.',
    voice_memo_url: null,
    voice_memo_duration: 45,
    match_score: 92,
    status: 'pending',
    applied_at: '2026-03-15T10:30:00Z',
  },
  {
    id: '2',
    applicant: {
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      verified: true,
      trust_score: 94,
      bio: 'UX Designerin aus München. Reise enthusiastisch und liebe neue Kulturen.',
      interests: ['Design', 'Museen', 'Kaffee', 'Städte erkunden'],
    },
    message: 'Hallo Lena! Ich bin Sarah und arbeite als UX Designerin. Dein Trip spricht mich total an - ich suche schon länger nach einer Gruppe für Remote Work in Portugal. Ich bin sehr organisiert und habe schon ein paar coole Airbnb-Optionen recherchiert.',
    voice_memo_url: null,
    voice_memo_duration: 62,
    match_score: 88,
    status: 'pending',
    applied_at: '2026-03-16T14:20:00Z',
  },
  {
    id: '3',
    applicant: {
      name: 'Tom',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
      verified: false,
      trust_score: 65,
      bio: 'Freelancer aus Hamburg. Immer auf der Suche nach dem nächsten Abenteuer.',
      interests: ['Surfen', 'Nachtleben', 'Musik', 'Festivals'],
    },
    message: 'Yo! Tom hier. Klingt nach einem coolen Trip. Bin dabei!',
    voice_memo_url: null,
    voice_memo_duration: null,
    match_score: 45,
    status: 'pending',
    applied_at: '2026-03-17T09:15:00Z',
  },
]

const TRIP_INFO = {
  title: '3 Wochen Remote Work in Lissabon',
  destination: 'Lissabon, Portugal',
  dates: '12. Sep - 3. Okt 2026',
  spots: '3/5 Plätze',
}

function getMatchScoreColor(score: number) {
  if (score >= 85) return 'bg-moss-green text-white'
  if (score >= 70) return 'bg-amber text-white'
  return 'bg-sunset-coral text-white'
}

function getMatchScoreLabel(score: number) {
  if (score >= 85) return 'Hervorragender Match'
  if (score >= 70) return 'Guter Match'
  return 'Schwacher Match'
}

export function ApplicationManager() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)
  const [selectedApp, setSelectedApp] = useState<typeof MOCK_APPLICATIONS[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  const handleAccept = (appId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'accepted' } : app
    ))
    setSelectedApp(null)
  }

  const handleReject = (appId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'rejected' } : app
    ))
    setSelectedApp(null)
  }

  const pendingApps = applications.filter(app => app.status === 'pending')
  const acceptedApps = applications.filter(app => app.status === 'accepted')
  const rejectedApps = applications.filter(app => app.status === 'rejected')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Trip Info Header */}
      <Card className="border-0 shadow-lg" style={{ borderRadius: '24px' }}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-deep-ocean mb-2">{TRIP_INFO.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-deep-ocean/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {TRIP_INFO.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {TRIP_INFO.dates}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {TRIP_INFO.spots}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge className="bg-moss-green/10 text-moss-green border-moss-green/20" style={{ borderRadius: '9999px' }}>
                {acceptedApps.length} Akzeptiert
              </Badge>
              <Badge className="bg-amber/10 text-amber border-amber/20" style={{ borderRadius: '9999px' }}>
                {pendingApps.length} Ausstehend
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-deep-ocean flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Neue Bewerbungen ({pendingApps.length})
        </h3>

        {pendingApps.length === 0 ? (
          <Card className="border-0 shadow-md" style={{ borderRadius: '24px' }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-soft-sand/50 flex items-center justify-center">
                <User className="w-8 h-8 text-deep-ocean/40" />
              </div>
              <p className="text-deep-ocean/60">
                Keine ausstehenden Bewerbungen. Dein Trip wird bald entdeckt!
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingApps.map((app) => (
            <Card
              key={app.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              style={{ borderRadius: '24px' }}
              onClick={() => setSelectedApp(app)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                      <AvatarImage src={app.applicant.avatar} />
                      <AvatarFallback className="bg-soft-sand text-deep-ocean text-lg">
                        {app.applicant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {app.applicant.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Verified className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-deep-ocean text-lg">{app.applicant.name}</h4>
                          <div className={`${getMatchScoreColor(app.match_score)} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                            {app.match_score}% Match
                          </div>
                        </div>
                        <p className="text-sm text-deep-ocean/50 mt-0.5">
                          Trust Score: {app.applicant.trust_score}/100
                        </p>
                      </div>
                      
                      <span className="text-xs text-deep-ocean/40 flex-shrink-0">
                        Vor 2 Tagen
                      </span>
                    </div>

                    {/* Mutual Interests */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {app.applicant.interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs px-2 py-1 bg-soft-sand/50 text-deep-ocean/70 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    {/* Preview Message */}
                    <p className="text-sm text-deep-ocean/70 mt-3 line-clamp-2">
                      {app.message}
                    </p>

                    {/* Voice Memo Indicator */}
                    {app.voice_memo_duration && (
                      <div className="flex items-center gap-2 mt-3 text-sunset-coral">
                        <Mic className="w-4 h-4" />
                        <span className="text-sm">Voice Memo ({app.voice_memo_duration}s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Accepted Section */}
      {acceptedApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-deep-ocean flex items-center gap-2">
            <Check className="w-5 h-5 text-moss-green" />
            Akzeptiert ({acceptedApps.length})
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {acceptedApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 bg-moss-green/10 px-4 py-3 rounded-2xl"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={app.applicant.avatar} />
                  <AvatarFallback>{app.applicant.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-deep-ocean">{app.applicant.name}</p>
                  <p className="text-xs text-moss-green">{app.match_score}% Match</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto border-0" style={{ borderRadius: '24px' }}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
                      <AvatarImage src={selectedApp.applicant.avatar} />
                      <AvatarFallback className="bg-soft-sand text-deep-ocean text-2xl">
                        {selectedApp.applicant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {selectedApp.applicant.verified && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Verified className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-deep-ocean">{selectedApp.applicant.name}</h3>
                    <div className={`${getMatchScoreColor(selectedApp.match_score)} inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-2`}>
                      {selectedApp.match_score}% Match - {getMatchScoreLabel(selectedApp.match_score)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-soft-sand rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-deep-ocean/60" />
                </button>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-deep-ocean/70">{selectedApp.applicant.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedApp.applicant.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-sm px-3 py-1 bg-soft-sand/50 text-deep-ocean/70 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-soft-sand/30 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-sunset-coral" />
                  <span className="font-semibold text-deep-ocean">Nachricht</span>
                </div>
                <p className="text-deep-ocean/80 leading-relaxed">{selectedApp.message}</p>
              </div>

              {/* Voice Memo */}
              {selectedApp.voice_memo_duration && (
                <div className="bg-deep-ocean/5 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                  <Mic className="w-5 h-5 text-sunset-coral" />
                    <span className="font-semibold text-deep-ocean">Voice Memo</span>
                    <span className="text-sm text-deep-ocean/50">({selectedApp.voice_memo_duration}s)</span>
                  </div>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-3 w-full p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-sunset-coral rounded-full flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="h-2 bg-soft-sand rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-sunset-coral rounded-full" />
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Response */}
              <div className="mb-6">
                <Label className="text-deep-ocean font-medium mb-2 block">
                  Antwort (optional)
                </Label>
                <Textarea
                  placeholder="Schreibe eine Nachricht an den Bewerber..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="min-h-[100px]"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedApp.id)}
                  className="flex-1 h-12 border-sunset-coral text-sunset-coral hover:bg-sunset-coral/10"
                  style={{ borderRadius: '9999px' }}
                >
                  <X className="w-5 h-5 mr-2" />
                  Ablehnen
                </Button>
                
                <Button
                  onClick={() => handleAccept(selectedApp.id)}
                  className="flex-1 h-12 bg-moss-green hover:bg-moss-green/90 text-white"
                  style={{ borderRadius: '9999px' }}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Annehmen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
