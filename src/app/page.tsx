import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Users, Verified, Heart } from "lucide-react"

// Mock data for demo
const featuredTrips = [
  {
    id: "1",
    title: "3 Wochen Portugal",
    destination: { name: "Lissabon, Portugal", country_code: "PT" },
    start_date: "2026-09-12",
    end_date: "2026-09-28",
    max_participants: 5,
    current_participants: 3,
    budget_range: { min: 1200, max: 1800, currency: "EUR" },
    image: "https://images.unsplash.com/photo-1555881400-74d7aca11d2a?w=800&q=80",
    creator: {
      name: "Lena",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      verified: true,
    },
    tags: ["Remote Work", "Co-Living", "Beach"],
  },
  {
    id: "2",
    title: "Bali Yoga Retreat",
    destination: { name: "Canggu, Bali", country_code: "ID" },
    start_date: "2026-10-05",
    end_date: "2026-10-19",
    max_participants: 4,
    current_participants: 2,
    budget_range: { min: 800, max: 1200, currency: "USD" },
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    creator: {
      name: "Max",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      verified: true,
    },
    tags: ["Yoga", "Wellness", "Nature"],
  },
  {
    id: "3",
    title: "Kapstadt Adventure",
    destination: { name: "Kapstadt, Südafrika", country_code: "ZA" },
    start_date: "2026-11-01",
    end_date: "2026-11-14",
    max_participants: 6,
    current_participants: 4,
    budget_range: { min: 1500, max: 2500, currency: "USD" },
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    creator: {
      name: "Sarah",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      verified: true,
    },
    tags: ["Adventure", "Safari", "Hiking"],
  },
]

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const formatter = new Intl.DateTimeFormat("de-DE", { month: "short", day: "numeric" })
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sunset-coral flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-deep-ocean">
                TravelMatch
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-deep-ocean/70 hover:text-deep-ocean transition-colors">
                Entdecken
              </a>
              <a href="#" className="text-sm text-deep-ocean/70 hover:text-deep-ocean transition-colors">
                Meine Trips
              </a>
              <a href="#" className="text-sm text-deep-ocean/70 hover:text-deep-ocean transition-colors">
                Community
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="w-5 h-5" />
              </Button>
              <Avatar className="w-9 h-9 border-2 border-sunset-coral">
                <AvatarImage src="" />
                <AvatarFallback className="bg-soft-sand text-deep-ocean text-sm">
                  Du
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-deep-ocean mb-4">
              Finde deine perfekte
              <span className="text-sunset-coral"> Reise-Crew</span>
            </h1>
            <p className="text-lg text-deep-ocean/70 max-w-2xl mx-auto mb-8">
              Verifizierte Reisende. KI-kuratiertes Matching. Sichere Abenteuer.
              <br />
              Nie wieder allein reisen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-sunset-coral hover:bg-sunset-coral/90 text-white rounded-full px-8"
              >
                Trip erstellen
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-deep-ocean/20 text-deep-ocean rounded-full px-8"
              >
                Trips entdecken
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="flex items-center gap-2 text-sm text-deep-ocean/60">
              <Verified className="w-4 h-4 text-moss-green" />
              <span>100% verifizierte Nutzer</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-deep-ocean/60">
              <Users className="w-4 h-4 text-moss-green" />
              <span>10.000+ erfolgreiche Trips</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-deep-ocean/60">
              <Heart className="w-4 h-4 text-sunset-coral" />
              <span>4.9/5 Nutzerbewertung</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips - Bento Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-deep-ocean">
              Entdecke Trips
            </h2>
            <Button variant="ghost" className="text-sunset-coral">
              Alle anzeigen →
            </Button>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips.map((trip, index) => (
              <Card 
                key={trip.id}
                className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                }`}
                style={{ borderRadius: '24px' }}
              >
                <div className="relative h-full">
                  {/* Image */}
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'h-80 lg:h-96' : 'h-48'
                  }`}>
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Floating Pills */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge 
                        className="bg-white/90 text-deep-ocean backdrop-blur-sm border-0"
                        style={{ borderRadius: '9999px' }}
                      >
                        {trip.destination.country_code === 'PT' && '🇵🇹'}
                        {trip.destination.country_code === 'ID' && '🇮🇩'}
                        {trip.destination.country_code === 'ZA' && '🇿🇦'}
                        {' '}
                        {trip.destination.name.split(',')[0]}
                      </Badge>
                    </div>
                    
                    {/* Creator Avatar */}
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
                          <AvatarImage src={trip.creator.avatar} />
                          <AvatarFallback>{trip.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        {trip.creator.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                            <Verified className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className={`font-bold mb-2 ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-lg'
                    }`}>
                      {trip.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{trip.current_participants}/{trip.max_participants} Plätze</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {trip.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button 
                      size={index === 0 ? 'lg' : 'sm'}
                      className="mt-4 bg-sunset-coral hover:bg-sunset-coral/90 text-white border-0"
                      style={{ borderRadius: '9999px' }}
                    >
                      Details ansehen
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-sand/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-deep-ocean mb-4">
              So funktioniert's
            </h2>
            <p className="text-deep-ocean/70 max-w-2xl mx-auto">
              In 4 einfachen Schritten zu deiner perfekten Reise-Crew
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Verifizieren",
                description: "Erstelle dein Profil mit sicherer KYC-Verifizierung. Keine Fake-Accounts.",
                icon: Verified,
              },
              {
                step: "02",
                title: "Vibe-Profil",
                description: "Beantworte kurze Fragen zu deinem Reisestil. Unsere KI findet Matches.",
                icon: Heart,
              },
              {
                step: "03",
                title: "Trip finden",
                description: "Entdecke Trips oder erstelle deinen eigenen. Bewirb dich mit Voice-Memo.",
                icon: MapPin,
              },
              {
                step: "04",
                title: "Crew bilden",
                description: "Chatte, plane und reise zusammen. Mit integriertem Split-Costs.",
                icon: Users,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-sunset-coral" />
                </div>
                <span className="text-sm text-sunset-coral font-semibold">
                  Schritt {item.step}
                </span>
                <h3 className="text-lg font-bold text-deep-ocean mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-deep-ocean/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-ocean mb-4">
              Bereit für dein nächstes Abenteuer?
            </h2>
            <p className="text-deep-ocean/70 mb-8 max-w-xl mx-auto">
              Schließe dich Tausenden von verifizierten Reisenden an. 
              Deine perfekte Crew wartet auf dich.
            </p>
            <Button 
              size="lg"
              className="bg-sunset-coral hover:bg-sunset-coral/90 text-white rounded-full px-12 py-6 text-lg"
            >
              Jetzt kostenlos starten
            </Button>
            <p className="text-sm text-deep-ocean/50 mt-4">
              Keine Kreditkarte erforderlich. Kostenlos für immer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-soft-sand">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sunset-coral flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-deep-ocean">TravelMatch</span>
            </div>
            <p className="text-sm text-deep-ocean/50">
              © 2026 TravelMatch. Sichere Reise-Crews für digitale Nomaden.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
