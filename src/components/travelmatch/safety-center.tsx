'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Flag,
  CheckCircle,
  Clock,
  User
} from 'lucide-react'

const SAFETY_FEATURES = [
  {
    id: 'emergency',
    title: 'Notfall-Button',
    description: 'Direkte Verbindung zum 24/7 Safety Support',
    icon: Phone,
    color: 'bg-sunset-coral',
  },
  {
    id: 'location',
    title: 'Standort-Teilen',
    description: 'Teile deinen Standort mit der Trip-Crew',
    icon: Shield,
    color: 'bg-moss-green',
  },
  {
    id: 'report',
    title: 'Melden & Blockieren',
    description: 'Problem melden oder Nutzer blockieren',
    icon: Flag,
    color: 'bg-amber',
  },
]

const SAFETY_TIPS = [
  'Teile deine Reisepläne mit Freunden oder Familie',
  'Treffe dich erst in öffentlichen Räumen',
  'Vertraue deinem Bauchgefühl',
  'Behalte deine Wertsachen immer im Blick',
  'Nutze die In-App Kommunikation vor dem Treffen',
]

export function SafetyCenter() {
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')

  const handleSubmitReport = () => {
    // Submit report logic
    setShowReportForm(false)
    setReportReason('')
    setReportDescription('')
  }

  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <Card className="border-sunset-coral/20 bg-sunset-coral/5" style={{ borderRadius: '24px' }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sunset-coral flex items-center justify-center flex-shrink-0">
              <Phone className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-bold text-deep-ocean">Notfall-Support</h2>
              <p className="text-sm text-deep-ocean/60">
                24/7 erreichbar für dringende Sicherheitsbedenken
              </p>
            </div>
            
            <Button 
              className="bg-sunset-coral hover:bg-sunset-coral/90 text-white h-12 px-6"
              style={{ borderRadius: '9999px' }}
            >
              Anrufen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAFETY_FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow" style={{ borderRadius: '24px' }}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-deep-ocean mb-1">{feature.title}</h3>
                <p className="text-sm text-deep-ocean/60">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Safety Tips */}
      <Card style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-deep-ocean flex items-center gap-2">
            <Shield className="w-5 h-5 text-moss-green" />
            Sicherheitstipps
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-3">
            {SAFETY_TIPS.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-moss-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-moss-green" />
                </div>
                <span className="text-deep-ocean/80">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Report Section */}
      <Card style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-deep-ocean flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber" />
            Problem melden
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-deep-ocean/60">
            Wenn du ein Problem mit einem Nutzer oder einer Situation hast, 
            kannst du uns hier anonym melden.
          </p>

          <Button
            onClick={() => setShowReportForm(true)}
            variant="outline"
            className="w-full h-12 border-amber text-amber hover:bg-amber/10"
            style={{ borderRadius: '12px' }}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Meldung erstellen
          </Button>
        </CardContent>
      </Card>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg" style={{ borderRadius: '24px' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-deep-ocean flex items-center gap-2">
                <Flag className="w-6 h-6 text-amber" />
                Problem melden
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Grund der Meldung</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Belästigung', 'Scam', 'Unangemessenes Verhalten', 'Andere'].map((reason) => (
                    <Button
                      key={reason}
                      type="button"
                      variant={reportReason === reason ? 'default' : 'outline'}
                      onClick={() => setReportReason(reason)}
                      className={`h-12 ${
                        reportReason === reason
                          ? 'bg-sunset-coral text-white border-sunset-coral'
                          : 'border-soft-sand'
                      }`}
                      style={{ borderRadius: '12px' }}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Beschreibung</label>
                <Textarea
                  placeholder="Beschreibe das Problem so detailliert wie möglich..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="min-h-[120px]"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Privacy Note */}
              <div className="p-4 bg-soft-sand/30 rounded-2xl">
                <p className="text-sm text-deep-ocean/60">
                  Deine Meldung wird vertraulich behandelt. Wir überprüfen alle 
                  Meldungen innerhalb von 24 Stunden.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 h-12"
                  style={{ borderRadius: '9999px' }}
                >
                  Abbrechen
                </Button>
                
                <Button
                  onClick={handleSubmitReport}
                  disabled={!reportReason || !reportDescription}
                  className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                  style={{ borderRadius: '9999px' }}
                >
                  Meldung absenden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
