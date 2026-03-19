'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet,
  Sparkles,
  Minus,
  Plus,
  Check,
  Plane,
  Loader2
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

// Mock destinations for autocomplete
const DESTINATIONS = [
  { name: 'Lissabon', country: 'Portugal', flag: '🇵🇹' },
  { name: 'Bali', country: 'Indonesien', flag: '🇮🇩' },
  { name: 'Kapstadt', country: 'Südafrika', flag: '🇿🇦' },
  { name: 'Mexiko City', country: 'Mexiko', flag: '🇲🇽' },
  { name: 'Barcelona', country: 'Spanien', flag: '🇪🇸' },
  { name: 'Lissabon', country: 'Portugal', flag: '🇵🇹' },
  { name: 'Chiang Mai', country: 'Thailand', flag: '🇹🇭' },
  { name: 'Medellín', country: 'Kolumbien', flag: '🇨🇴' },
]

export function NomadSyncTripCreation() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  
  // Form data
  const [destination, setDestination] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [isFlexible, setIsFlexible] = useState(false)
  const [peopleCount, setPeopleCount] = useState(2)
  const [budget, setBudget] = useState(1500)
  const [description, setDescription] = useState('')
  const [enhancedDescription, setEnhancedDescription] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredDestinations = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(destination.toLowerCase()) ||
    d.country.toLowerCase().includes(destination.toLowerCase())
  ).slice(0, 5)

  const handleEnhance = async () => {
    if (!description) return
    setIsEnhancing(true)
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setEnhancedDescription(`✨ ${description}\n\n🎯 Perfekt für:\n• Remote Worker, die das Meer lieben\n• Frühaufsteher für Sonnenaufgang-Sessions\n• Foodies, die portugiesische Küche entdecken wollen\n\n🏄 Was erwartet dich:\n• Tägliches Surfen in world-class Spots\n• Co-Working Spaces mit Meerblick\n• Sunset Drinks an der Algarve`)
    setIsEnhancing(false)
  }

  const handlePublish = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep(4) // Success screen
  }

  const totalSteps = 3

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.dune }}>
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.softSand }}
          >
            <X className="w-5 h-5" style={{ color: COLORS.deepOcean }} />
          </button>
          
          <div className="flex-1 mx-4">
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i + 1 === step ? 40 : 20,
                    backgroundColor: i + 1 <= step ? COLORS.sunsetCoral : COLORS.softSand,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-sm" style={{ color: COLORS.fog }}>
              Step {step} of {totalSteps}
            </p>
          </div>
          
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Destination */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                <h1 
                  className="text-3xl font-bold mb-8"
                  style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
                >
                  Wohin geht die Reise?
                </h1>

                {/* Destination Input */}
                <div className="relative mb-6">
                  <div 
                    className="text-4xl font-light mb-4 pb-2 border-b-2 transition-colors"
                    style={{ 
                      borderColor: destination ? COLORS.sunsetCoral : COLORS.softSand,
                      color: COLORS.deepOcean,
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    <Input
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value)
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      placeholder="Tippe eine Stadt oder ein Land..."
                      className="border-0 bg-transparent text-4xl p-0 h-auto placeholder:text-gray-300 focus-visible:ring-0"
                      style={{ fontFamily: 'Georgia, serif' }}
                    />
                  </div>

                  {/* Autocomplete Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && filteredDestinations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-lg"
                        style={{ backgroundColor: 'white' }}
                      >
                        {filteredDestinations.map((dest, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setDestination(`${dest.name}, ${dest.country}`)
                              setShowSuggestions(false)
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span className="text-2xl">{dest.flag}</span>
                            <div>
                              <p className="font-medium" style={{ color: COLORS.deepOcean }}>
                                {dest.name}
                              </p>
                              <p className="text-sm" style={{ color: COLORS.fog }}>
                                {dest.country}
                              </p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3" style={{ color: COLORS.fog }}>
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Zeitraum
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      placeholder="Von"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="h-14 rounded-2xl"
                      style={{ backgroundColor: COLORS.softSand, border: 'none' }}
                    />
                    <Input
                      type="date"
                      placeholder="Bis"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="h-14 rounded-2xl"
                      style={{ backgroundColor: COLORS.softSand, border: 'none' }}
                    />
                  </div>
                </div>

                {/* Flexible Checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="flexible"
                    checked={isFlexible}
                    onCheckedChange={(checked) => setIsFlexible(checked as boolean)}
                  />
                  <label htmlFor="flexible" className="text-sm" style={{ color: COLORS.fog }}>
                    Ich bin flexibel mit den Daten
                  </label>
                </div>
              </div>

              {/* Next Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button
                  onClick={() => setStep(2)}
                  disabled={!destination}
                  className="h-14 px-8 rounded-full text-base font-semibold"
                  style={{ 
                    backgroundColor: destination ? COLORS.sunsetCoral : COLORS.softSand,
                    color: destination ? 'white' : COLORS.fog,
                  }}
                >
                  Weiter
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: People & Budget */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                <h1 
                  className="text-3xl font-bold mb-8"
                  style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
                >
                  Wer soll mit?
                </h1>

                {/* People Counter */}
                <div className="mb-8">
                  <p className="text-center mb-4" style={{ color: COLORS.fog }}>
                    Ich suche...
                  </p>
                  
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      <Minus className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
                    </button>
                    
                    <div 
                      className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-bold"
                      style={{ 
                        backgroundColor: COLORS.sunsetCoral,
                        color: 'white',
                      }}
                    >
                      {peopleCount}
                    </div>
                    
                    <button
                      onClick={() => setPeopleCount(Math.min(10, peopleCount + 1))}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      <Plus className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
                    </button>
                  </div>
                  
                  <p className="text-center mt-4" style={{ color: COLORS.fog }}>
                    ...weitere {peopleCount === 1 ? 'Person' : 'Personen'}
                  </p>
                </div>

                {/* Budget Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-4" style={{ color: COLORS.fog }}>
                    <Wallet className="w-4 h-4 inline mr-2" /
                    Geschätztes Budget p.P.
                  </label>
                  
                  <div className="px-2">
                    <Slider
                      value={[budget]}
                      onValueChange={(value) => setBudget(Array.isArray(value) ? value[0] : value)}
                      min={500}
                      max={5000}
                      step={100}
                      className="mb-4"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: COLORS.fog }}>500€</span>
                      <div 
                        className="px-4 py-2 rounded-full text-xl font-bold"
                        style={{ 
                          backgroundColor: COLORS.softSand,
                          color: COLORS.deepOcean,
                        }}
                      >
                        {budget}€
                      </div>
                      <span className="text-sm" style={{ color: COLORS.fog }}>5000€+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="h-14 px-6 rounded-full"
                  style={{ borderColor: COLORS.softSand }}
                >
                  Zurück
                </Button>
                
                <Button
                  onClick={() => setStep(3)}
                  className="h-14 px-8 rounded-full text-base font-semibold"
                  style={{ 
                    backgroundColor: COLORS.sunsetCoral,
                    color: 'white',
                  }}
                >
                  Weiter
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: The Vibe & AI Magic */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1">
                <h1 
                  className="text-3xl font-bold mb-4"
                  style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
                >
                  The Vibe & KI Magic
                </h1>

                {/* Description Input */}
                <div className="mb-4">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beschreibe kurz, was du planst..."
                    maxLength={500}
                    className="min-h-[120px] rounded-2xl text-lg resize-none"
                    style={{ backgroundColor: COLORS.softSand, border: 'none' }}
                  />
                  
                  <div className="flex justify-end mt-2">
                    <span className="text-sm" style={{ color: COLORS.fog }}>
                      {description.length}/500
                    </span>
                  </div>
                </div>

                {/* AI Enhance Button */}
                <button
                  onClick={handleEnhance}
                  disabled={!description || isEnhancing}
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-6 transition-all"
                  style={{ 
                    backgroundColor: description ? 'rgba(232,106,83,0.1)' : COLORS.softSand,
                    border: `2px dashed ${description ? COLORS.sunsetCoral : COLORS.fog}`,
                    color: description ? COLORS.sunsetCoral : COLORS.fog,
                  }}
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>KI arbeitet...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Mach meinen Pitch sexy</span>
                    </>
                  )}
                </button>

                {/* Enhanced Description */}
                <AnimatePresence>
                  {enhancedDescription && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 rounded-2xl"
                      style={{ backgroundColor: 'rgba(107,142,107,0.1)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4" style={{ color: COLORS.sageGreen }} />
                        <span className="text-sm font-medium" style={{ color: COLORS.sageGreen }}>
                          KI-Enhanced
                        </span>
                      </div>
                      
                      <pre 
                        className="text-sm whitespace-pre-wrap font-sans"
                        style={{ color: COLORS.deepOcean }}
                      >
                        {enhancedDescription}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Publish Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <Button
                  onClick={handlePublish}
                  disabled={isLoading || !description}
                  className="w-full h-16 rounded-2xl text-lg font-bold"
                  style={{ 
                    backgroundColor: COLORS.sunsetCoral,
                    color: 'white',
                    boxShadow: `0 10px 30px ${COLORS.sunsetCoral}50`,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Veröffentlichen...
                    </>
                  ) : (
                    <>
                      🚀 Trip veröffentlichen
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setStep(2)}
                  variant="ghost"
                  className="w-full"
                  style={{ color: COLORS.fog }}
                >
                  Zurück
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: COLORS.sageGreen }}
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
              >
                Trip erstellt!
              </h2>
              
              <p className="mb-8" style={{ color: COLORS.fog }}>
                Dein Abenteuer beginnt jetzt. Wir suchen nach deinem perfekten Crew-Match.
              </p>
              
              <Button
                className="h-14 px-8 rounded-full text-base font-semibold"
                style={{ 
                  backgroundColor: COLORS.sunsetCoral,
                  color: 'white',
                }}
              >
                Zu meinem Trip
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
