'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MapPin, Users, Wallet, Sparkles, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const TRIP_TYPES = [
  { id: 'coworking', label: 'Co-Working', icon: '💻' },
  { id: 'leisure', label: 'Entspannung', icon: '🏖️' },
  { id: 'adventure', label: 'Abenteuer', icon: '🏔️' },
  { id: 'mixed', label: 'Gemischt', icon: '🌟' },
]

const BUDGET_RANGES = [
  { id: 'budget', label: 'Budget', min: 0, max: 1000, currency: 'EUR' },
  { id: 'mid', label: 'Mittel', min: 1000, max: 3000, currency: 'EUR' },
  { id: 'luxury', label: 'Luxus', min: 3000, max: 10000, currency: 'EUR' },
]

export function TripCreator() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    tripType: 'mixed',
    maxParticipants: 4,
    budgetRange: 'mid',
    vibeDescription: '',
  })

  const handleCreateTrip = async () => {
    setLoading(true)
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setStep(4) // Success step
  }

  const generateMoodboard = async () => {
    // AI moodboard generation would go here
    console.log('Generating moodboard...')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto" style={{ borderRadius: '24px' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-deep-ocean">
              {step === 4 ? '✨ Trip erstellt!' : 'Neuen Trip erstellen'}
            </CardTitle>
            {step !== 4 && (
              <p className="text-sm text-deep-ocean/60 mt-1">
                Schritt {step} von 3
              </p>
            )}
          </div>
          {step !== 4 && (
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-sunset-coral' : 'bg-soft-sand'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">
                <MapPin className="w-4 h-4 inline mr-2" />
                Zielort
              </Label>
              <Input
                placeholder="z.B. Lissabon, Portugal"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="h-12"
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Zeitraum
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                    style={{ borderRadius: '12px' }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "d. MMM", { locale: de })} -{" "}
                          {format(dateRange.to, "d. MMM y", { locale: de })}
                        </>
                      ) : (
                        format(dateRange.from, "d. MMM y", { locale: de })
                      )
                    ) : (
                      "Wähle einen Zeitraum"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range ? { from: range.from || new Date(), to: range.to || new Date() } : undefined)}
                    numberOfMonths={2}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Trip Type */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">Art der Reise</Label>
              <div className="grid grid-cols-2 gap-3">
                {TRIP_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant={formData.tripType === type.id ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, tripType: type.id })}
                    className={`h-14 ${
                      formData.tripType === type.id
                        ? 'bg-sunset-coral text-white border-sunset-coral'
                        : 'border-soft-sand'
                    }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!formData.destination || !dateRange}
              className="w-full h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
              style={{ borderRadius: '9999px' }}
            >
              Weiter
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">Titel deines Trips</Label>
              <Input
                placeholder="z.B. 3 Wochen Remote Work in Lissabon"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12"
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">Beschreibung</Label>
              <Textarea
                placeholder="Beschreibe deinen Trip, was ihr unternehmen wollt, was für Leute du suchst..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
                style={{ borderRadius: '12px' }}
              />
            </div>

            {/* Max Participants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-deep-ocean flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Maximale Gruppengröße
                </Label>
                <span className="text-sunset-coral font-semibold">
                  {formData.maxParticipants} Personen
                </span>
              </div>
              <Slider
                value={[formData.maxParticipants]}
                onValueChange={(value) => setFormData({ ...formData, maxParticipants: Array.isArray(value) ? value[0] : value })}
                min={2}
                max={10}
                step={1}
              />
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <Label className="text-deep-ocean flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Geschätztes Budget pro Person
              </Label>
              <div className="flex gap-3">
                {BUDGET_RANGES.map((range) => (
                  <Button
                    key={range.id}
                    type="button"
                    variant={formData.budgetRange === range.id ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, budgetRange: range.id })}
                    className={`flex-1 h-14 ${
                      formData.budgetRange === range.id
                        ? 'bg-sunset-coral text-white border-sunset-coral'
                        : 'border-soft-sand'
                    }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <div className="text-center">
                      <div className="font-medium">{range.label}</div>
                      <div className="text-xs opacity-80">
                        {range.currency} {range.min.toLocaleString()} - {range.max.toLocaleString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12"
                style={{ borderRadius: '9999px' }}
              >
                Zurück
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.title || !formData.description}
                className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                style={{ borderRadius: '9999px' }}
              >
                Weiter
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {/* Vibe Description */}
            <div className="space-y-2">
              <Label className="text-deep-ocean">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Beschreibe den Vibe deines Trips
              </Label>
              <Textarea
                placeholder="z.B. Wir sind eine entspannte Gruppe von Remote Workern, die gerne morgens Yoga macht, tagsüber arbeitet und abends die Stadt erkundet..."
                value={formData.vibeDescription}
                onChange={(e) => setFormData({ ...formData, vibeDescription: e.target.value })}
                className="min-h-[100px]"
                style={{ borderRadius: '12px' }}
              />
              <p className="text-xs text-deep-ocean/50">
                Unsere KI generiert daraus ein Moodboard und findet passende Matches.
              </p>
            </div>

            {/* Preview */}
            <div className="bg-soft-sand/30 rounded-2xl p-4 space-y-3">
              <h4 className="font-semibold text-deep-ocean">Vorschau</h4>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-sunset-coral to-amber rounded-xl flex items-center justify-center text-2xl">
                  {TRIP_TYPES.find(t => t.id === formData.tripType)?.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-deep-ocean">{formData.title || 'Dein Trip Titel'}</h5>
                  <p className="text-sm text-deep-ocean/60">
                    {formData.destination} • {dateRange?.from && format(dateRange.from, "MMM d", { locale: de })} - {dateRange?.to && format(dateRange.to, "MMM d", { locale: de })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" style={{ borderRadius: '9999px' }}>
                      {formData.maxParticipants} Personen
                    </Badge>
                    <Badge variant="secondary" style={{ borderRadius: '9999px' }}>
                      {BUDGET_RANGES.find(b => b.id === formData.budgetRange)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-12"
                style={{ borderRadius: '9999px' }}
              >
                Zurück
              </Button>
              <Button
                onClick={handleCreateTrip}
                disabled={loading || !formData.vibeDescription}
                className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                style={{ borderRadius: '9999px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Erstelle Trip...
                  </>
                ) : (
                  'Trip veröffentlichen'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-moss-green rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-deep-ocean">
              Dein Trip ist live!
            </h3>
            
            <p className="text-deep-ocean/60">
              Wir haben ein Moodboard generiert und suchen nach passenden Reisenden.
              Du erhältst Benachrichtigungen bei neuen Bewerbungen.
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/trips'}
                className="h-12 px-6"
                style={{ borderRadius: '9999px' }}
              >
                Zu meinen Trips
              </Button>
              <Button
                onClick={() => window.location.href = '/discover'}
                className="h-12 px-6 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                style={{ borderRadius: '9999px' }}
              >
                Weitere Trips entdecken
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
