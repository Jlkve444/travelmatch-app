'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  Flame, 
  ThumbsUp, 
  HelpCircle,
  Moon,
  Sunrise,
  Users,
  Activity,
  Plane,
  MessageCircle,
  X,
  Check
} from 'lucide-react'

// Mock match data
const MOCK_MATCH = {
  userId: 'user-123',
  matchScore: 94,
  compatibilityBreakdown: {
    vibeSimilarity: 96,
    travelStyle: 90,
    schedule: 100,
    activity: 85,
    social: 95,
  },
  reasons: [
    'Eure Reisevibes sind sehr ähnlich',
    'Gemeinsame Interessen: Photography, Hiking',
    'Ihr beide seht früh auf 🌅',
    'Beide Digital Nomads - perfekt für Coworking! 💻',
  ],
  user: {
    id: 'user-123',
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
}

interface MatchCardProps {
  matchScore: number
  user: {
    name: string
    avatar: string
    age: number
    location: string
    bio: string
    trustScore: number
    isVerified: boolean
    languages: string[]
    travelStyle: string[]
  }
  compatibilityBreakdown: {
    vibeSimilarity: number
    travelStyle: number
    schedule: number
    activity: number
    social: number
  }
  reasons: string[]
  onAccept?: () => void
  onDecline?: () => void
  onMessage?: () => void
}

function getMatchQuality(score: number) {
  if (score >= 90) {
    return { 
      label: 'Perfect Match', 
      color: '#7A9E7E', 
      emoji: '✨',
      icon: Sparkles,
      bgColor: 'bg-moss-green/10',
      textColor: 'text-moss-green'
    }
  } else if (score >= 75) {
    return { 
      label: 'Great Match', 
      color: '#7A9E7E', 
      emoji: '🔥',
      icon: Flame,
      bgColor: 'bg-moss-green/10',
      textColor: 'text-moss-green'
    }
  } else if (score >= 60) {
    return { 
      label: 'Good Match', 
      color: '#D4A373', 
      emoji: '👍',
      icon: ThumbsUp,
      bgColor: 'bg-amber/10',
      textColor: 'text-amber'
    }
  } else {
    return { 
      label: 'Possible Match', 
      color: '#E86A53', 
      emoji: '🤔',
      icon: HelpCircle,
      bgColor: 'bg-sunset-coral/10',
      textColor: 'text-sunset-coral'
    }
  }
}

function MatchScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const quality = getMatchQuality(score)
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E4DC"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={quality.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-deep-ocean">{score}</span>
        <span className="text-xs text-deep-ocean/50">%</span>
      </div>
    </div>
  )
}

function CompatibilityBar({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType 
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-deep-ocean/70">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <span className="font-medium text-deep-ocean">{value}%</span>
      </div>
      <div className="h-2 bg-soft-sand rounded-full overflow-hidden">
        <div 
          className="h-full bg-sunset-coral rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function MatchCard({
  matchScore = MOCK_MATCH.matchScore,
  user = MOCK_MATCH.user,
  compatibilityBreakdown = MOCK_MATCH.compatibilityBreakdown,
  reasons = MOCK_MATCH.reasons,
  onAccept,
  onDecline,
  onMessage,
}: Partial<MatchCardProps> = {}) {
  const [showDetails, setShowDetails] = useState(false)
  const quality = getMatchQuality(matchScore)
  const QualityIcon = quality.icon

  return (
    <Card 
      className="overflow-hidden border-2 border-soft-sand/50 hover:border-sunset-coral/30 transition-all"
      style={{ borderRadius: '24px' }}
    >
      {/* Header with Match Score */}
      <div className="relative bg-gradient-to-br from-dune to-soft-sand p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-sunset-coral text-white text-xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-moss-green rounded-full flex items-center justify-center border-2 border-white">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-deep-ocean">{user.name}</h3>
              <span className="text-deep-ocean/50">{user.age}</span>
            </div>
            <p className="text-sm text-deep-ocean/60 flex items-center gap-1">
              <span>📍</span> {user.location}
            </p>
            
            {/* Trust Score */}
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="secondary" 
                className="bg-amber/10 text-amber border-0"
                style={{ borderRadius: '9999px' }}
              >
                ⭐ {user.trustScore}
              </Badge>
              {user.isVerified && (
                <Badge 
                  className="bg-moss-green/10 text-moss-green border-0"
                  style={{ borderRadius: '9999px' }}
                >
                  ✓ Verifiziert
                </Badge>
              )}
            </div>
          </div>

          {/* Match Score Ring */}
          <div className="flex flex-col items-center">
            <MatchScoreRing score={matchScore} />
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${quality.textColor}`}>
              <QualityIcon className="w-4 h-4" />
              {quality.label}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Bio */}
        <p className="text-deep-ocean/80 text-sm leading-relaxed">
          {user.bio}
        </p>

        {/* Languages & Travel Style */}
        <div className="flex flex-wrap gap-2">
          {user.languages.map((lang) => (
            <Badge 
              key={lang} 
              variant="outline"
              className="border-soft-sand text-deep-ocean/70"
              style={{ borderRadius: '9999px' }}
            >
              🌐 {lang}
            </Badge>
          ))}
          {user.travelStyle.slice(0, 3).map((style) => (
            <Badge 
              key={style}
              className="bg-sunset-coral/10 text-sunset-coral border-0"
              style={{ borderRadius: '9999px' }}
            >
              {style}
            </Badge>
          ))}
        </div>

        {/* Match Reasons */}
        <div className="bg-moss-green/5 rounded-2xl p-4 space-y-2">
          <h4 className="font-semibold text-deep-ocean text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-moss-green" />
            Warum ihr matchen
          </h4>
          <ul className="space-y-1">
            {reasons.slice(0, 3).map((reason, i) => (
              <li key={i} className="text-sm text-deep-ocean/70 flex items-start gap-2">
                <span className="text-moss-green">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Compatibility Breakdown (Collapsible) */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-sm font-medium text-deep-ocean hover:text-sunset-coral transition-colors"
          >
            <span>Kompatibilitäts-Details</span>
            <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showDetails && (
            <div className="mt-4 space-y-3">
              <CompatibilityBar 
                label="Vibe Ähnlichkeit" 
                value={compatibilityBreakdown.vibeSimilarity}
                icon={Sparkles}
              />
              <CompatibilityBar 
                label="Reisestil" 
                value={compatibilityBreakdown.travelStyle}
                icon={Plane}
              />
              <CompatibilityBar 
                label="Tagesrhythmus" 
                value={compatibilityBreakdown.schedule}
                icon={Sunrise}
              />
              <CompatibilityBar 
                label="Aktivitätslevel" 
                value={compatibilityBreakdown.activity}
                icon={Activity}
              />
              <CompatibilityBar 
                label="Soziale Präferenz" 
                value={compatibilityBreakdown.social}
                icon={Users}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1 h-12 border-soft-sand hover:bg-sunset-coral/10 hover:text-sunset-coral hover:border-sunset-coral"
            style={{ borderRadius: '9999px' }}
          >
            <X className="w-5 h-5 mr-2" />
            Nicht jetzt
          </Button>
          
          <Button
            variant="outline"
            onClick={onMessage}
            className="flex-1 h-12 border-soft-sand"
            style={{ borderRadius: '9999px' }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Nachricht
          </Button>
          
          <Button
            onClick={onAccept}
            className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
            style={{ borderRadius: '9999px' }}
          >
            <Check className="w-5 h-5 mr-2" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for lists
export function MatchCardCompact({ 
  matchScore, 
  user,
  onClick 
}: { 
  matchScore: number
  user: MatchCardProps['user']
  onClick?: () => void
}) {
  const quality = getMatchQuality(matchScore)

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:border-sunset-coral/30 transition-all"
      style={{ borderRadius: '20px' }}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-14 h-14">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-sunset-coral text-white">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          {user.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-moss-green rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-deep-ocean truncate">{user.name}</h4>
            <span className="text-deep-ocean/50 text-sm">{user.age}</span>
          </div>
          <p className="text-sm text-deep-ocean/60 truncate">{user.bio}</p>
          <div className="flex items-center gap-2 mt-1">
            {user.travelStyle.slice(0, 2).map((style) => (
              <span key={style} className="text-xs text-sunset-coral bg-sunset-coral/10 px-2 py-0.5 rounded-full">
                {style}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: quality.color }}
          >
            {matchScore}
          </div>
          <span className="text-xs text-deep-ocean/50 mt-1">{quality.emoji}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Match Score Badge for trip cards
export function MatchScoreBadge({ score }: { score: number }) {
  const quality = getMatchQuality(score)
  const QualityIcon = quality.icon

  return (
    <div 
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${quality.bgColor} ${quality.textColor}`}
    >
      <QualityIcon className="w-3.5 h-3.5" />
      <span className="font-semibold text-sm">{score}%</span>
      <span className="text-xs opacity-80 hidden sm:inline">{quality.label}</span>
    </div>
  )
}
