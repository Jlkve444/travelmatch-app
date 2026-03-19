# TravelMatch

**Sichere, KI-kuratierte Reise-Crews für dein nächstes Abenteuer.**

Eine vertrauensbasierte Plattform für Reisende, die nach kompatiblen Reisepartnern suchen. Der USP ist die Kombination aus strenger Verifizierung (KYC/Biometrie), KI-basiertem Vibe-Matching und integrierter Trip-Planung.

## 🚀 Tech Stack

| Layer | Technologie |
|-------|-------------|
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS v4 |
| **UI Library** | shadcn/ui |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **Vector DB** | pgvector (in Supabase) |
| **Auth** | Passkeys (WebAuthn) + Magic Links + OAuth |
| **KYC** | Stripe Identity |
| **AI** | OpenAI (Embeddings) |
| **Storage** | Cloudflare R2 |

## 🎨 Design System

**Theme:** "Immersive Earthy Minimalism"

- **Background:** Dune `#F7F5F0` (Warm Sand)
- **Primary:** Sunset Coral `#E86A53`
- **Trust:** Deep Ocean `#1A2B3C`
- **Success:** Moss Green `#7A9E7E`

## 📁 Projektstruktur

```
travelmatch/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Design Tokens
│   │   ├── layout.tsx
│   │   └── page.tsx        # Landing Page
│   ├── components/
│   │   ├── ui/             # shadcn/ui Components
│   │   └── travelmatch/    # Custom Components
│   │       └── auth-form.tsx
│   ├── lib/
│   │   └── supabase/
│   │       └── client.ts   # Supabase Client + Types
│   └── types/              # TypeScript Types
├── supabase/
│   └── migrations/         # Database Migrations
├── public/                 # Static Assets
└── package.json
```

## 🛠️ Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
```

Fülle die Variablen in `.env.local` aus:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
```

### 3. Supabase einrichten

1. Erstelle ein neues Supabase Projekt
2. Führe die Migration aus:
   ```bash
   psql -h your-project.supabase.co -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
   ```
3. Aktiviere die Auth Provider (Google, Apple)

### 4. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## 📊 Database Schema

### Core Tables

- **users** - Nutzerprofile mit KYC-Status
- **vibe_profiles** - Persönlichkeitsprofile für Matching
- **trips** - Reise-Angebote mit Vibe-Embeddings
- **trip_applications** - Bewerbungen mit Match-Score
- **chat_rooms** - Chat-Räume für Trips
- **messages** - Nachrichten
- **reviews** - Bewertungen nach Reisen
- **expenses** - Geteilte Ausgaben

### Key Features

- **pgvector** für Vibe-Embeddings (256 Dimensionen)
- **Row Level Security (RLS)** für Datenschutz
- **Realtime** für Chat-Funktionalität

## 🚀 Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Umgebungsvariablen in Vercel

Stelle sicher, dass alle `NEXT_PUBLIC_*` Variablen in Vercel konfiguriert sind.

## 📈 Roadmap

### Phase 1: Foundation (Woche 1-3) 🔴
- [x] Repository Setup
- [x] Design System
- [x] Landing Page
- [ ] Supabase Auth
- [ ] KYC Integration

### Phase 2: Trip Core (Woche 4-6) 🔴
- [ ] Trip erstellen
- [ ] Trip Feed
- [ ] Bewerbungen

### Phase 3: Matching (Woche 7-8) 🔴
- [ ] Vibe-Profile
- [ ] KI-Matching
- [ ] Match-Score

### Phase 4: Chat (Woche 9-10) 🟡
- [ ] Real-time Chat
- [ ] Gruppen-Chats
- [ ] Voice-Memos

### Phase 5: Safety (Woche 11-12) 🟡
- [ ] Reviews
- [ ] Reports
- [ ] Safety Support

### Phase 6: Logistics (Woche 13-14) 🟢
- [ ] Split-Expenses
- [ ] Collaborative Itinerary

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE)

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📧 Kontakt

- Website: [travelmatch.app](https://travelmatch.app)
- Email: hello@travelmatch.app
- Twitter: [@travelmatch](https://twitter.com/travelmatch)

---

**Made with ❤️ by the TravelMatch Team**
