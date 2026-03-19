'use client'

import { useState } from 'react'
import { NomadSyncOnboarding } from '@/components/travelmatch/nomad-sync-onboarding'
import { NomadSyncDiscover } from '@/components/travelmatch/nomad-sync-discover'
import { NomadSyncTripCreation } from '@/components/travelmatch/nomad-sync-trip-creation'
import { NomadSyncTripDetails } from '@/components/travelmatch/nomad-sync-trip-details'
import { NomadSyncCreatorDashboard } from '@/components/travelmatch/nomad-sync-creator-dashboard'
import { NomadSyncCrewSpace } from '@/components/travelmatch/nomad-sync-crew-space'
import { NomadSyncUserProfile } from '@/components/travelmatch/nomad-sync-user-profile'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [currentView, setCurrentView] = useState<
    'landing' | 'onboarding' | 'discover' | 'trip-creation' | 'trip-details' | 'creator-dashboard' | 'crew-space' | 'user-profile'
  >('landing')

  if (currentView === 'onboarding') {
    return <NomadSyncOnboarding />
  }

  if (currentView === 'discover') {
    return <NomadSyncDiscover />
  }

  if (currentView === 'trip-creation') {
    return <NomadSyncTripCreation />
  }

  if (currentView === 'trip-details') {
    return <NomadSyncTripDetails />
  }

  if (currentView === 'creator-dashboard') {
    return <NomadSyncCreatorDashboard />
  }

  if (currentView === 'crew-space') {
    return <NomadSyncCrewSpace />
  }

  if (currentView === 'user-profile') {
    return <NomadSyncUserProfile />
  }

  // Landing Page with navigation to all screens
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#1A2B3C', fontFamily: 'Georgia, serif' }}>
            NomadSync
          </h1>
          <p className="text-xl" style={{ color: '#7A8B99' }}>
            Find your crew. See the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'onboarding', label: '🔐 Onboarding & KYC', desc: 'Login, Verifizierung, Vibe Check' },
            { id: 'discover', label: '🔍 Discover Feed', desc: 'Trip-Entdeckung mit Match Scores' },
            { id: 'trip-creation', label: '✨ Trip Creation', desc: 'Wizard mit KI-Magic' },
            { id: 'trip-details', label: '📍 Trip Details', desc: 'Radar Chart, Bewerbung, Voice Notes' },
            { id: 'creator-dashboard', label: '👤 Creator Dashboard', desc: 'Swipe-Bewerber-Management' },
            { id: 'crew-space', label: '💬 Crew Space', desc: 'Chat mit Expenses & Polls' },
            { id: 'user-profile', label: '👤 User Profile', desc: 'Trust Score, Reviews, Past Trips' },
          ].map((screen) => (
            <button
              key={screen.id}
              onClick={() => setCurrentView(screen.id as any)}
              className="p-6 rounded-3xl text-left transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A2B3C' }}>
                {screen.label}
              </h2>
              <p style={{ color: '#7A8B99' }}>{screen.desc}</p>
              <div className="mt-4 flex items-center" style={{ color: '#E86A53' }}>
                <span className="text-sm font-medium">Öffnen →</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: '#E86A5320' }}>
          <p className="text-center text-sm" style={{ color: '#E86A53' }}>
            🎨 Alle Screens mit NomadSync Branding: Dune, Sunset Coral, Deep Ocean, Sage Green
          </p>
        </div>
      </div>
    </div>
  )
}
