'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MapPin, 
  Calendar, 
  Wallet, 
  Users,
  Star,
  CheckCircle2,
  Mic,
  Send,
  X,
  Pause,
  Loader2,
  ChevronRight
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

// Mock Trip Data
const TRIP = {
  id: '1',
  title: 'Herbst in den Highlands',
  location: { name: 'Schottland', country: '🇬🇧' },
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  dates: '12. - 24. Nov',
  budget: '~1.200€',
  spotsAvailable: 2,
  totalSpots: 5,
  matchScore: 88,
  description: 'Wir erkunden die schottischen Highlands im Herbst - die perfekte Zeit für goldene Landschaften, alte Burgen und Whisky-Destillerien.',
  creator: {
    id: 'user-1',
    name: 'Finn',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    isVerified: true,
    rating: 4.9,
    trips: 12,
  },
  vibeMatch: {
    overall: 88,
    breakdown: {
      nature: 95,
      activity: 85,
      social: 75,
      schedule: 90,
      budget: 80,
    },
  },
}

// Radar Chart Component
function VibeRadarChart({ match }: { match: typeof TRIP.vibeMatch }) {
  const size = 200
  const center = size / 2
  const radius = 80

  const axes = [
    { label: 'Natur', value: match.breakdown.nature, angle: -90 },
    { label: 'Aktiv', value: match.breakdown.activity, angle: -18 },
    { label: 'Sozial', value: match.breakdown.social, angle: 54 },
    { label: 'Zeit', value: match.breakdown.schedule, angle: 126 },
    { label: 'Budget', value: match.breakdown.budget, angle: 198 },
  ]

  const getPoint = (value: number, angle: number) => {
    const rad = (angle * Math.PI) / 180
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    }
  }

  const userPoints = axes.map(a => getPoint(a.value, a.angle))

  return (
    <div className="relative">
      <svg width={size} height={size} className="mx-auto">
        {axes.map((a, i) => {
          const end = getPoint(100, a.angle)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={COLORS.softSand}
              strokeWidth={1}
            />
          )
        })}

        <polygon
          points={userPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill={`${COLORS.sunsetCoral}30`}
          stroke={COLORS.sunsetCoral}
          strokeWidth={2}
        />

        {userPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={COLORS.sunsetCoral} />
        ))}

        {axes.map((a, i) => {
          const pos = getPoint(115, a.angle)
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fill={COLORS.fog}
            >
              {a.label}
            </text>
          )
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl font-bold" style={{ color: COLORS.sunsetCoral }}>
            {match.overall}%
          </span>
          <p className="text-xs" style={{ color: COLORS.fog }}>Match</p>
        </div>
      </div>
    </div>
  )
}

export function NomadSyncTripDetails() {
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationText, setApplicationText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [hasVoiceNote, setHasVoiceNote] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 300], [0, 100])
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  const handleSubmit = async () => {
    if (applicationText.length < 100 && !hasVoiceNote) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowApplyModal(false)
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: COLORS.dune }}>
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div
          style={{ y: imageY, opacity: imageOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${TRIP.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10">
          <button 
            className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-2">
            <button 
              className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Bookmark 
                className={`w-5 h-5 ${isSaved ? 'fill-white text-white' : 'text-white'}`} 
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {TRIP.title}
          </motion.h1>
          
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{TRIP.location.name} {TRIP.location.country}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Creator Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl flex items-center gap-4"
          style={{ backgroundColor: COLORS.softSand }}
        >
          <div className="relative">
            <Avatar className="w-14 h-14">
              <AvatarImage src={TRIP.creator.avatar} />
              <AvatarFallback>{TRIP.creator.name[0]}</AvatarFallback>
            </Avatar>
            {TRIP.creator.isVerified && (
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.sageGreen }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: COLORS.deepOcean }}>
                {TRIP.creator.name}, {TRIP.creator.age}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium" style={{ color: COLORS.deepOcean }}>
                  {TRIP.creator.rating}
                </span>
              </div>
              
              <span className="text-sm" style={{ color: COLORS.fog }}>
                • {TRIP.creator.trips} Trips
              </span>
            </div>
          </div>

          <ChevronRight className="w-5 h-5" style={{ color: COLORS.fog }} />
        </motion.div>

        {/* Vibe Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl"
          style={{ backgroundColor: 'white' }}
        >
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: COLORS.deepOcean }}>
            Vibe Match
          </h3>

          <VibeRadarChart match={TRIP.vibeMatch} />

          <p className="text-center mt-4 text-sm" style={{ color: COLORS.fog }}>
            Ihr habt eine <strong style={{ color: COLORS.sunsetCoral }}>{TRIP.vibeMatch.overall}%ige</strong> Übereinstimmung.
          </p>
        </motion.div>

        {/* Hard Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.softSand }}>
            <Calendar className="w-4 h-4" style={{ color: COLORS.fog }} />
            <span className="text-sm" style={{ color: COLORS.deepOcean }}>{TRIP.dates}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.softSand }}>
            <Wallet className="w-4 h-4" style={{ color: COLORS.fog }} />
            <span className="text-sm" style={{ color: COLORS.deepOcean }}>{TRIP.budget}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.sunsetCoral + '20' }}>
            <Users className="w-4 h-4" style={{ color: COLORS.sunsetCoral }} />
            <span className="text-sm font-medium" style={{ color: COLORS.sunsetCoral }}>
              Noch {TRIP.spotsAvailable} Plätze
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.deepOcean }}>
            Über den Trip
          </h3>
          
          <p className="text-sm leading-relaxed" style={{ color: COLORS.deepOcean }}>
            {TRIP.description}
          </p>
        </motion.div>
      </div>

      {/* Sticky Apply Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <Button
          onClick={() => setShowApplyModal(true)}
          className="w-full h-14 rounded-full text-lg font-bold"
          style={{ 
            backgroundColor: COLORS.sunsetCoral,
            color: 'white',
            boxShadow: `0 10px 30px ${COLORS.sunsetCoral}50`,
          }}
        >
          Auf Trip bewerben
        </Button>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
              style={{ backgroundColor: COLORS.dune, maxHeight: '85vh' }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: COLORS.softSand }}>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>Bewerbung</h2>
                  <p className="text-sm" style={{ color: COLORS.fog }}>{TRIP.title}</p>
                </div>
                
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.softSand }}
                >
                  <X className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
                </button>
              </div>

              <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.deepOcean }}>
                    Warum bist du perfekt für diese Crew?
                  </label>                  
                  
                  <Textarea
                    value={applicationText}
                    onChange={(e) => setApplicationText(e.target.value)}
                    placeholder="Erzähle etwas über dich..."
                    className="min-h-[150px] rounded-2xl resize-none"
                    style={{ backgroundColor: COLORS.softSand, border: 'none' }}
                  />
                  
                  <div className="flex justify-end mt-2">
                    <span 
                      className="text-sm"
                      style={{ color: applicationText.length >= 100 ? COLORS.sageGreen : COLORS.fog }}
                    >
                      {applicationText.length}/100 Zeichen min.
                    </span>
                  </div>
                </div>

                <div className="py-4 border-t border-b" style={{ borderColor: COLORS.softSand }}>
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: isRecording ? COLORS.sunsetCoral : COLORS.softSand,
                      }}
                    >
                      {isRecording ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8" style={{ color: COLORS.deepOcean }} />
                      )}
                    </motion.button>

                    <p className="text-sm text-center" style={{ color: COLORS.fog }}>
                      {isRecording ? 'Tippe zum Beenden' : 'Oder hinterlasse eine Voice-Note'}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (applicationText.length < 100 && !hasVoiceNote)}
                  className="w-full h-14 rounded-full text-lg font-bold"
                  style={{ 
                    backgroundColor: (applicationText.length >= 100 || hasVoiceNote) 
                      ? COLORS.sunsetCoral 
                      : COLORS.softSand,
                    color: (applicationText.length >= 100 || hasVoiceNote) ? 'white' : COLORS.fog,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Bewerbung absenden
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
