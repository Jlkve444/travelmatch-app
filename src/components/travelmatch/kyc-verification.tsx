'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  Camera, 
  Upload, 
  Loader2, 
  AlertCircle,
  Fingerprint,
  FileCheck,
  UserCheck
} from 'lucide-react'

const KYC_STEPS = [
  {
    id: 'identity',
    title: 'Identitätsnachweis',
    description: 'Lade deinen Reisepass oder Personalausweis hoch',
    icon: FileCheck,
  },
  {
    id: 'selfie',
    title: 'Selfie-Verifizierung',
    description: 'Mache ein Live-Selfie für den Liveness-Check',
    icon: Camera,
  },
  {
    id: 'biometric',
    title: 'Biometrische Prüfung',
    description: 'Wir vergleichen dein Gesicht mit dem Ausweis',
    icon: Fingerprint,
  },
  {
    id: 'review',
    title: 'Überprüfung',
    description: 'Unser Team prüft deine Dokumente',
    icon: UserCheck,
  },
]

export function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified')
  const [uploadedFiles, setUploadedFiles] = useState<{ id?: File; selfie?: File }>({})
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (type: 'id' | 'selfie', file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }))
    setProgress(prev => prev + 25)
  }

  const startVerification = async () => {
    setIsVerifying(true)
    setKycStatus('pending')
    
    // Simulate verification process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(i)
    }
    
    setKycStatus('verified')
    setIsVerifying(false)
    setProgress(100)
  }

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <Badge className="bg-moss-green text-white" style={{ borderRadius: '9999px' }}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Verifiziert
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-amber text-white" style={{ borderRadius: '9999px' }}>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            In Prüfung
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-sunset-coral text-white" style={{ borderRadius: '9999px' }}>
            <AlertCircle className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" style={{ borderRadius: '9999px' }}>
            Nicht verifiziert
          </Badge>
        )
    }
  }

  if (kycStatus === 'verified') {
    return (
      <Card className="w-full max-w-md mx-auto" style={{ borderRadius: '24px' }}>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-moss-green/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-moss-green" />
          </div>
          
          <h2 className="text-2xl font-bold text-deep-ocean mb-2">
            Verifizierung abgeschlossen!
          </h2>
          
          <p className="text-deep-ocean/60 mb-6">
            Deine Identität wurde erfolgreich verifiziert. 
            Du erhältst jetzt das "Verifizierter Explorer" Badge.
          </p>

          <div className="flex items-center justify-center gap-2 p-4 bg-moss-green/10 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-deep-ocean">Verifizierter Explorer</p>
              <p className="text-sm text-deep-ocean/50">Trust Score: 100/100</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto" style={{ borderRadius: '24px' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-deep-ocean flex items-center gap-2">
              <Shield className="w-6 h-6 text-sunset-coral" />
              Identitätsverifizierung
            </CardTitle>
            <CardDescription className="text-deep-ocean/60 mt-1">
              Verifiziere deine Identität für mehr Vertrauen und Sicherheit
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-deep-ocean/60">Fortschritt</span>
            <span className="font-medium text-deep-ocean">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {KYC_STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const Icon = step.icon

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCompleted
                    ? 'bg-moss-green/5 border-moss-green/20'
                    : isCurrent
                    ? 'bg-sunset-coral/5 border-sunset-coral/20'
                    : 'bg-soft-sand/30 border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-moss-green text-white'
                        : isCurrent
                        ? 'bg-sunset-coral text-white'
                        : 'bg-soft-sand text-deep-ocean/40'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-deep-ocean">{step.title}</h3>
                    <p className="text-sm text-deep-ocean/60 mt-1">{step.description}</p>

                    {isCurrent && step.id === 'identity' && (
                      <div className="mt-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload('id', file)
                              setCurrentStep(1)
                            }
                          }}
                        />
                        
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="w-full h-12 border-dashed border-2"
                          style={{ borderRadius: '12px' }}
                        >
                          {uploadedFiles.id ? (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2 text-moss-green" />
                              {uploadedFiles.id.name}
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" />
                              Ausweis hochladen
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {isCurrent && step.id === 'selfie' && (
                      <div className="mt-4">
                        <input
                          type="file"
                          ref={selfieInputRef}
                          accept="image/*"
                          capture="user"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload('selfie', file)
                              setCurrentStep(2)
                            }
                          }}
                        />
                        
                        <Button
                          onClick={() => selfieInputRef.current?.click()}
                          className="w-full h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                          style={{ borderRadius: '12px' }}
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Selfie aufnehmen
                        </Button>
                      </div>
                    )}

                    {isCurrent && step.id === 'biometric' && (
                      <div className="mt-4">
                        <Button
                          onClick={() => {
                            setCurrentStep(3)
                            startVerification()
                          }}
                          disabled={!uploadedFiles.id || !uploadedFiles.selfie}
                          className="w-full h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                          style={{ borderRadius: '12px' }}
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Wird verifiziert...
                            </>
                          ) : (
                            <>
                              <Fingerprint className="w-5 h-5 mr-2" />
                              Verifizierung starten
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info */}
        <div className="p-4 bg-soft-sand/30 rounded-2xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-deep-ocean/40 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-deep-ocean/60">
              <p className="font-medium text-deep-ocean mb-1">Warum Verifizierung?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Mehr Vertrauen in der Community</li>
                <li>Höhere Sichtbarkeit für deine Trips</li>
                <li>Zugang zu Premium-Features</li>
                <li>Sichereres Reiseerlebnis</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
