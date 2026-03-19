'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  X, 
  Check, 
  MessageCircle, 
  Play, 
  Pause, 
  Users, 
  Settings,
  UserPlus,
  AlertCircle,
  Zap,
  Clock,
  MapPin,
  Calendar,
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
  amber: '#D4A373',
}

// Mock Applicants Data
const APPLICANTS = [
  {
    id: 'app-1',
    user: {
      id: 'user-1',
      name: 'Sarah',
      age: 27,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      isVerified: true,
      location: 'Berlin, DE',
      bio: 'Digital Marketing Manager | Coffee addict | Always planning the next trip',
    },
    matchScore: 94,
    application: {
      type: 'text',
      content: 'Hey! Ich bin Sarah und arbeite remote als Marketing Managerin. Ich liebe das Meer und bin schon lange auf der Suche nach einer coolen Crew für einen Surf-Trip. Bin super flexibel was Zeiten angeht und habe schon Erfahrung mit Co-Living.',
      submittedAt: '2 Stunden ago',
    },
    aiSummary: {
      pros: ['Remote Worker', 'Flexibel', 'Co-Living Erfahrung'],
      cons: ['Budget etwas niedriger'],
      recommendation: 'strong',
    },
  },
  {
    id: 'app-2',
    user: {
      id: 'user-2',
      name: 'Marc',
      age: 31,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      isVerified: true,
      location: 'München, DE',
      bio: 'Software Engineer | Surfing since 2015 | Digital Nomad',
    },
    matchScore: 88,
    application: {
      type: 'voice',
      duration: 28,
      submittedAt: '5 Stunden ago',
    },
    aiSummary: {
      pros: ['Surfing Erfahrung', 'Tech Background', 'Digital Nomad'],
      cons: [],
      recommendation: 'perfect',
    },
  },
  {
    id: 'app-3',
    user: {
      id: 'user-3',
      name: 'Emma',
      age: 25,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      isVerified: false,
      location: 'Hamburg, DE',
      bio: 'Photographer | Yoga Instructor | Nature lover',
    },
    matchScore: 76,
    application: {
      type: 'text',
      content: 'Hi! Ich bin Emma, Fotografin und Yogalehrerin. Ich würde gerne die Wellen fotografieren und morgens Yoga am Strand machen.',
      submittedAt: '1 Tag ago',
    },
    aiSummary: {
      pros: ['Kreative Skills', 'Yoga'],
      cons: ['Kein Remote Work', 'Weniger Erfahrung'],
      recommendation: 'maybe',
    },
  },
]

// Mock Crew Members
const CREW = [
  {
    id: 'crew-1',
    name: 'Finn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    role: 'Creator',
    isVerified: true,
    joinedAt: '2 Wochen ago',
  },
  {
    id: 'crew-2',
    name: 'Lena',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    role: 'Member',
    isVerified: true,
    joinedAt: '3 Tage ago',
  },
]

// Voice Player Component
function VoicePlayer({ duration }: { duration: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: COLORS.softSand }}>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: COLORS.sunsetCoral }}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="h-8 flex items-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${Math.random() * 24 + 8}px`,
                backgroundColor: i / 20 < progress ? COLORS.sunsetCoral : COLORS.fog + '40',
              }}
            />
          ))}
        </div>
      </div>

      <span className="text-sm font-medium" style={{ color: COLORS.deepOcean }}>
        {formatTime(duration)}
      </span>
    </div>
  )
}

// Applicant Card Component
function ApplicantCard({ 
  applicant, 
  onSwipe 
}: { 
  applicant: typeof APPLICANTS[0]
  onSwipe: (direction: 'left' | 'right' | 'up') => void 
}) {
  const x = useRef(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right')
    } else if (info.offset.x < -100) {
      onSwipe('left')
    } else if (info.offset.y < -100) {
      onSwipe('up')
    }
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div 
        className="h-full rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'white' }}
      >
        {/* User Header */}
        <div className="relative h-48">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${applicant.user.avatar})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {applicant.user.name}, {applicant.user.age}
                  </h2>
                  
                  {applicant.user.isVerified && (
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.sageGreen }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                  <MapPin className="w-3 h-3" />
                  {applicant.user.location}
                </div>
              </div>

              <div 
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center"
                style={{ backgroundColor: COLORS.sageGreen }}
              >
                <Zap className="w-5 h-5 text-white mb-0.5" />
                <span className="text-xl font-bold text-white">{applicant.matchScore}</span>
                <span className="text-xs text-white/80">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="p-4 border-b" style={{ borderColor: COLORS.softSand }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" style={{ color: COLORS.amber }} />
            <span className="text-sm font-medium" style={{ color: COLORS.amber }}>
              KI-Analyse
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {applicant.aiSummary.pros.map((pro, i) => (
              <Badge 
                key={i}
                className="bg-moss-green/10 text-moss-green border-0"
              >
                + {pro}
              </Badge>
            ))}
            {applicant.aiSummary.cons.map((con, i) => (
              <Badge 
                key={i}
                className="bg-sunset-coral/10 text-sunset-coral border-0"
              >
                ! {con}
              </Badge>
            ))}
          </div>

          {applicant.aiSummary.recommendation === 'perfect' && (
            <div 
              className="flex items-center gap-2 text-sm"
              style={{ color: COLORS.sageGreen }}
            >
              <Check className="w-4 h-4" />
              Perfekter Match!
            </div>
          )}
        </div>

        {/* Application Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-sm mb-3" style={{ color: COLORS.fog }}>
            Bewerbung {applicant.application.submittedAt}
          </p>

          {applicant.application.type === 'voice' ? (
            <VoicePlayer duration={applicant.application.duration as number} />
          ) : (
            <div 
              className="p-4 rounded-2xl text-sm leading-relaxed"
              style={{ backgroundColor: COLORS.softSand, color: COLORS.deepOcean }}
            >
              "{applicant.application.content}"
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function NomadSyncCreatorDashboard() {
  const [activeTab, setActiveTab] = useState('applicants')
  const [applicants, setApplicants] = useState(APPLICANTS)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentApplicant = applicants[currentIndex]
    
    if (direction === 'left') {
      // Reject
      console.log('Rejected:', currentApplicant.user.name)
    } else if (direction === 'right') {
      // Accept to crew
      console.log('Accepted:', currentApplicant.user.name)
    } else if (direction === 'up') {
      // Chat first
      console.log('Chat with:', currentApplicant.user.name)
    }

    // Move to next
    setCurrentIndex(prev => prev + 1)
  }

  return (
    <div className="min-h-screen pb-6" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.softSand }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" style={{ color: COLORS.deepOcean }} />
          </button>

          <h1 className="text-lg font-bold" style={{ color: COLORS.deepOcean }}>
            Mein Trip: Lissabon Surf
          </h1>

          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-2xl" style={{ backgroundColor: COLORS.softSand }}>
          {[
            { id: 'applicants', label: 'Bewerber', count: 12 },
            { id: 'crew', label: 'Die Crew', count: '2/4' },
            { id: 'settings', label: 'Einstellungen' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? COLORS.deepOcean : COLORS.fog,
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tab.label}
              {tab.count && (
                <span 
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={{ 
                    backgroundColor: activeTab === tab.id ? COLORS.sunsetCoral : COLORS.fog + '30',
                    color: activeTab === tab.id ? 'white' : COLORS.fog,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {currentIndex < applicants.length ? (
              <>
                {/* Card Stack */}
                <div className="relative h-[600px]">
                  <AnimatePresence>
                    {applicants.slice(currentIndex, currentIndex + 2).map((applicant, index) => (
                      <ApplicantCard
                        key={applicant.id}
                        applicant={applicant}
                        onSwipe={index === 0 ? handleSwipe : () => {}}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: COLORS.softSand }}
                  >
                    <X className="w-7 h-7" style={{ color: COLORS.fog }} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('up')}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: COLORS.amber }}
                  >
                    <MessageCircle className="w-6 h-6 text-white" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: COLORS.sageGreen }}
                  >
                    <Check className="w-7 h-7 text-white" />
                  </motion.button>
                </div>

                <p className="text-center text-sm mt-4" style={{ color: COLORS.fog }}>
                  Swipe oder tippe, um zu entscheiden
                </p>
              </>
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: COLORS.softSand }}
                >
                  <Check className="w-10 h-10" style={{ color: COLORS.sageGreen }} />
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.deepOcean }}>
                  Alle Bewerbungen geprüft!
                </h3>
                
                <p style={{ color: COLORS.fog }}>
                  Du hast alle {applicants.length} Bewerber bewertet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crew' && (
          <div className="space-y-4">
            <Button
              className="w-full h-14 rounded-2xl text-base font-bold mb-4"
              style={{ 
                backgroundColor: COLORS.sunsetCoral,
                color: 'white',
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Gruppen-Chat für Crew starten
            </Button>

            <div className="space-y-3">
              {CREW.map((member) => (
                <div 
                  key={member.id}
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="relative">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    {member.isVerified && (
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COLORS.sageGreen }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: COLORS.deepOcean }}>
                        {member.name}
                      </span>
                      
                      <Badge 
                        className="border-0"
                        style={{ 
                          backgroundColor: member.role === 'Creator' ? COLORS.sunsetCoral + '20' : COLORS.softSand,
                          color: member.role === 'Creator' ? COLORS.sunsetCoral : COLORS.fog,
                        }}
                      >
                        {member.role}
                      </Badge>
                    </div>
                    
                    <p className="text-sm" style={{ color: COLORS.fog }}>
                      Beigetreten {member.joinedAt}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5" style={{ color: COLORS.fog }} />
                </div>
              ))}
            </div>

            <div 
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ backgroundColor: COLORS.softSand }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.sunsetCoral + '20' }}
              >
                <UserPlus className="w-6 h-6" style={{ color: COLORS.sunsetCoral }} />
              </div>
              
              <div className="flex-1">
                <p className="font-medium" style={{ color: COLORS.deepOcean }}>
                  Noch 2 Plätze frei
                </p>
                <p className="text-sm" style={{ color: COLORS.fog }}>
                  Trip ist zu 50% gebucht
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {[
              { icon: Calendar, label: 'Reisezeitraum ändern', value: '14. - 28. Okt' },
              { icon: Users, label: 'Crew-Größe', value: '4 Personen' },
              { icon: AlertCircle, label: 'Anforderungen', value: 'Verifiziert' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full p-4 rounded-2xl flex items-center gap-4"
                style={{ backgroundColor: 'white' }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: COLORS.softSand }}
                >
                  <item.icon className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-medium" style={{ color: COLORS.deepOcean }}>
                    {item.label}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.fog }}>
                    {item.value}
                  </p>
                </div>
                
                <ChevronRight className="w-5 h-5" style={{ color: COLORS.fog }} />
              </button>
            ))}

            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2"
              style={{ borderColor: COLORS.sunsetCoral, color: COLORS.sunsetCoral }}
            >
              <X className="w-5 h-5 mr-2" />
              Trip abbrechen
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
