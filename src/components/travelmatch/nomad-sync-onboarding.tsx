'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Apple,
  Chrome,
  Mail,
  ArrowRight,
  Shield,
  Camera,
  ScanFace,
  CheckCircle2,
  Sun,
  Moon,
  Plane
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

export function NomadSyncOnboarding() {
  const [step, setStep] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [vibePosition, setVibePosition] = useState(50)
  const [isScanning, setIsScanning] = useState(false)

  // Auto-advance KYC after scan
  useEffect(() => {
    if (step === 2 && isScanning) {
      const timer = setTimeout(() => {
        setIsVerified(true)
        setTimeout(() => setStep(3), 1500)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, isScanning])

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: COLORS.dune }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, rgba(26,43,60,0.3) 0%, rgba(232,106,83,0.1) 100%)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Splash & Login */}
        {step === 0 && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {/* Logo & Tagline */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div 
                    className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: COLORS.sunsetCoral,
                      boxShadow: `0 20px 40px ${COLORS.sunsetCoral}40`
                    }}
                  >
                    <Plane className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h1 
                  className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  NomadSync
                </h1>
                
                <p 
                  className="text-xl md:text-2xl text-white/90"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Find your crew. See the world.
                </p>
              </motion.div>
            </div>

            {/* Login Buttons */}
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="p-6 space-y-3 pb-12"
            >
              <Button
                onClick={() => setStep(1)}
                className="w-full h-14 text-base font-semibold"
                style={{ 
                  backgroundColor: '#000000',
                  borderRadius: '9999px',
                  color: 'white'
                }}
              >
                <Apple className="w-5 h-5 mr-3" />
                Mit Apple fortfahren
              </Button>

              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full h-14 text-base font-semibold border-2"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: COLORS.deepOcean,
                  color: COLORS.deepOcean,
                  borderRadius: '9999px'
                }}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Mit Google fortfahren
              </Button>

              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full h-14 text-base font-semibold"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '9999px'
                }}
              >
                <Mail className="w-5 h-5 mr-3" />
                Mit E-Mail fortfahren
              </Button>

              <p className="text-center text-sm text-white/60 mt-4">
                Mit der Anmeldung akzeptierst du unsere AGBs.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: KYC Verification */}
        {step === 1 && (
          <motion.div
            key="kyc"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 min-h-screen flex flex-col p-6"
            style={{ backgroundColor: COLORS.dune }}
          >
            <div className="pt-12 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6" style={{ color: COLORS.sageGreen }} />
                <span className="text-sm font-medium" style={{ color: COLORS.sageGreen }}>
                  Verifizierung
                </span>
              </div>
              
              <h2 
                className="text-3xl font-bold mb-3"
                style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
              >
                Trust is everything.
              </h2>
              
              <p style={{ color: COLORS.fog }}>
                Wir verifizieren alle Mitglieder, um eine sichere Community zu schaffen.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="p-6 rounded-3xl cursor-pointer"
                style={{ 
                  backgroundColor: COLORS.softSand,
                  border: `2px dashed ${COLORS.fog}`
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: COLORS.sunsetCoral }}
                  >
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: COLORS.deepOcean }}>
                      Schritt 1: ID Scannen
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.fog }}>
                      Reisepass oder Personalausweis
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: COLORS.fog }} />
                </div>
              </motion.div>

              <div 
                className="p-6 rounded-3xl opacity-50"
                style={{ backgroundColor: COLORS.softSand }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: COLORS.fog }}
                  >
                    <ScanFace className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: COLORS.deepOcean }}>
                      Schritt 2: 3D Face Scan
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.fog }}>
                      Wie bei Face ID
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Face Scan */}
        {step === 2 && (
          <motion.div
            key="face-scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: COLORS.deepOcean }}
          >
            {!isVerified ? (
              <>
                <div className="relative">
                  <motion.div
                    className="w-64 h-64 rounded-full border-4 flex items-center justify-center"
                    style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <ScanFace className="w-24 h-24 text-white/60" />
                  </motion.div>
                </div>

                <p className="text-white/80 mt-8 text-lg">
                  Scanne dein Gesicht...
                </p>

                <Button
                  onClick={() => setIsScanning(true)}
                  className="mt-8 h-14 px-8"
                  style={{ 
                    backgroundColor: COLORS.sunsetCoral,
                    borderRadius: '9999px',
                    color: 'white'
                  }}
                >
                  Scan starten
                </Button>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div 
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: COLORS.sageGreen }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  Du bist verifiziert!
                </h2>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Vibe Check */}
        {step === 3 && (
          <motion.div
            key="vibe"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 min-h-screen flex flex-col p-6"
            style={{ backgroundColor: COLORS.dune }}
          >
            <div className="pt-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: COLORS.fog }}>
                  Profil-Setup
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS.sunsetCoral }}>
                  1/3
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.softSand }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: '33%',
                    backgroundColor: COLORS.sunsetCoral 
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <h2 
                className="text-3xl font-bold mb-8"
                style={{ color: COLORS.deepOcean, fontFamily: 'Georgia, serif' }}
              >
                Was ist dein Travel-Vibe?
              </h2>

              <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-80 flex items-center justify-center"
                >
                  <div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: `linear-gradient(to bottom, 
                        ${vibePosition > 50 ? 'rgba(107,142,107,0.2)' : 'rgba(26,43,60,0.1)'} 0%, 
                        ${vibePosition > 50 ? 'rgba(232,106,83,0.1)' : 'rgba(107,142,107,0.2)'} 100%)`
                    }}
                  />

                  <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                    <Sun className="w-6 h-6" style={{ color: COLORS.sageGreen }} />
                    <div>
                      <p className="font-semibold" style={{ color: COLORS.deepOcean }}>
                        5 AM Sunrise Hike
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-16 relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vibePosition}
                      onChange={(e) => setVibePosition(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                    
                    <div 
                      className="w-16 h-64 rounded-full relative overflow-hidden"
                      style={{ backgroundColor: COLORS.softSand }}
                    >
                      <div 
                        className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300"
                        style={{ 
                          height: `${vibePosition}%`,
                          background: `linear-gradient(to top, ${COLORS.sunsetCoral}, ${COLORS.sageGreen})`
                        }}
                      />
                      
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-white"
                        style={{ 
                          bottom: `calc(${vibePosition}% - 24px)`,
                          boxShadow: `0 4px 20px ${COLORS.sunsetCoral}40`
                        }}
                        whileTap={{ scale: 1.1 }}
                      >
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: vibePosition > 50 ? COLORS.sageGreen : COLORS.sunsetCoral 
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <Moon className="w-6 h-6" style={{ color: COLORS.deepOcean }} />
                    <div>
                      <p className="font-semibold" style={{ color: COLORS.deepOcean }}>
                        2 AM Neon Clubbing
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setStep(4)}
                    className="w-16 h-16 rounded-full"
                    style={{ 
                      backgroundColor: COLORS.sunsetCoral,
                      boxShadow: `0 10px 30px ${COLORS.sunsetCoral}50`
                    }}
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
