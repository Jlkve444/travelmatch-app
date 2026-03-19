'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, MapPin, Calendar, Users, Wallet, Camera, Check } from 'lucide-react'
import { useAppState } from '@/contexts/app-state-context'

const COLORS = {
  dune: '#F7F5F0',
  softSand: '#EBE7DD',
  sunsetCoral: '#E86A53',
  deepOcean: '#1A2B3C',
  fog: '#7A8B99',
  sageGreen: '#6B8E6B',
}

const TAGS = [
  'Remote Work', 'Co-Living', 'Beach', 'Yoga', 'Wellness', 'Nature',
  'Adventure', 'Safari', 'Hiking', 'Surfing', 'Photography', 'Foodie',
  'Party', 'Culture', 'History', 'Art', 'Music', 'Sports'
]

export default function CreateTripPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createTrip, loading } = useAppState()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    country_code: '',
    start_date: '',
    end_date: '',
    max_participants: 4,
    budget_range: { min: 1000, max: 2000, currency: 'EUR' },
    image_url: '',
    tags: [] as string[],
  })

  const handleSubmit = async () => {
    if (!user) return
    
    const { error } = await createTrip({
      title: formData.title,
      description: formData.description,
      destination: formData.destination,
      country_code: formData.country_code,
      start_date: formData.start_date,
      end_date: formData.end_date,
      max_participants: formData.max_participants,
      current_participants: 1,
      budget_range: formData.budget_range,
      image_url: formData.image_url,
      tags: formData.tags,
    })
    
    if (!error) {
      router.push('/')
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: COLORS.dune }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
            Trip erstellen
          </h1>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex-1 h-2 rounded-full"
                style={{
                  backgroundColor: s <= step ? COLORS.sunsetCoral : COLORS.softSand
                }}
              />
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: COLORS.fog }}>
            Schritt {step} von 4
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 pb-24">
        <div className="max-w-lg mx-auto">
          <Card className="p-6" style={{ borderRadius: '24px' }}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
                  Wohin geht's? 🌍
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                    Reiseziel
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.fog }} />
                    <Input
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="z.B. Lissabon, Portugal"
                      className="pl-10"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                    Land (2-Buchstaben Code)
                  </label>
                  <Input
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                    placeholder="z.B. PT"
                    maxLength={2}
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                      Von
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.fog }} />
                      <Input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="pl-10"
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                      Bis
                    </label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
                  Wer darf mit? 👥
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                    Trip-Titel
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="z.B. 3 Wochen Portugal Surf Adventure"
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                    Beschreibung
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Was macht diesen Trip besonders?"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-xl resize-none"
                    style={{ borderRadius: '12px', borderColor: COLORS.softSand }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: COLORS.deepOcean }}>
                    Max. Teilnehmer
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFormData({ ...formData, max_participants: Math.max(2, formData.max_participants - 1) })}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold" style={{ color: COLORS.deepOcean }}>
                      {formData.max_participants}
                    </span>
                    <button
                      onClick={() => setFormData({ ...formData, max_participants: Math.min(10, formData.max_participants + 1) })}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
                  Budget & Tags 💰
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: COLORS.deepOcean }}>
                    Geschätztes Budget p.P.
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={formData.budget_range.currency}
                      onChange={(e) => setFormData({ ...formData, budget_range: { ...formData.budget_range, currency: e.target.value } })}
                      className="px-3 py-2 border rounded-xl"
                    >
                      <option value="EUR">€</option>
                      <option value="USD">$</option>
                      <option value="GBP">£</option>
                    </select>
                    <Input
                      type="number"
                      value={formData.budget_range.min}
                      onChange={(e) => setFormData({ ...formData, budget_range: { ...formData.budget_range, min: parseInt(e.target.value) } })}
                      placeholder="Min"
                      style={{ borderRadius: '12px' }}
                    />
                    <span style={{ color: COLORS.fog }}>-</span>
                    <Input
                      type="number"
                      value={formData.budget_range.max}
                      onChange={(e) => setFormData({ ...formData, budget_range: { ...formData.budget_range, max: parseInt(e.target.value) } })}
                      placeholder="Max"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: COLORS.deepOcean }}>
                    Tags (mehrere wählbar)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1.5 rounded-full text-sm transition-colors"
                        style={{
                          backgroundColor: formData.tags.includes(tag) ? COLORS.sunsetCoral : COLORS.softSand,
                          color: formData.tags.includes(tag) ? 'white' : COLORS.deepOcean,
                        }}
                      >
                        {formData.tags.includes(tag) && <Check className="w-3 h-3 inline mr-1" />}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold" style={{ color: COLORS.deepOcean }}>
                  Cover Bild 📸
                </h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: COLORS.deepOcean }}>
                    Bild URL
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 w-5 h-5" style={{ color: COLORS.fog }} />
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="pl-10"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>

                {formData.image_url && (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
                      }}
                    />
                  </div>
                )}

                <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.softSand }}>
                  <h3 className="font-semibold mb-2" style={{ color: COLORS.deepOcean }}>
                    Zusammenfassung
                  </h3>
                  <p style={{ color: COLORS.fog }} className="text-sm">
                    {formData.title || 'Kein Titel'}
                  </p>
                  <p style={{ color: COLORS.fog }} className="text-sm">
                    📍 {formData.destination || 'Kein Ziel'}
                  </p>
                  <p style={{ color: COLORS.fog }} className="text-sm">
                    👥 {formData.max_participants} Teilnehmer
                  </p>
                  <p style={{ color: COLORS.fog }} className="text-sm">
                    🏷️ {formData.tags.join(', ') || 'Keine Tags'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1"
                  style={{ borderRadius: '9999px' }}
                >
                  Zurück
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  className="flex-1"
                  style={{ 
                    backgroundColor: COLORS.sunsetCoral,
                    borderRadius: '9999px',
                    color: 'white'
                  }}
                >
                  Weiter
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                  style={{ 
                    backgroundColor: COLORS.sageGreen,
                    borderRadius: '9999px',
                    color: 'white'
                  }}
                >
                  {loading ? 'Wird erstellt...' : 'Trip erstellen'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
