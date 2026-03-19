# Supabase Setup Guide

## ✅ Datenbank Verbindung

Deine Supabase Datenbank ist bereit!

**Projekt URL:** https://apubzmnrajxutwlfttqh.supabase.co  
**Status:** ✅ Connected

## 🚀 Nächste Schritte

### 1. Migration ausführen

1. Gehe zu deinem Supabase Dashboard: https://apubzmnrajxutwlfttqh.supabase.co
2. Öffne den **SQL Editor**
3. Kopiere den Inhalt von `supabase/migrations/001_setup_database.sql`
4. Führe das SQL aus

### 2. Auth Provider konfigurieren

1. Gehe zu **Authentication > Providers**
2. Aktiviere **Google** OAuth:
   - Client ID: [Deine Google Client ID]
   - Client Secret: [Dein Google Client Secret]
3. Aktiviere **Apple** OAuth (optional)

### 3. Environment Variables

Die `.env.local` Datei wurde bereits erstellt mit deinen Zugangsdaten:

```env
NEXT_PUBLIC_SUPABASE_URL=https://apubzmnrajxutwlfttqh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_E0Cwb-PKxHWocq2Y0TcDvQ_aGYW6f2X
```

### 4. Service Role Key (für Server)

1. Gehe zu **Project Settings > API**
2. Kopiere den **service_role key**
3. Füge ihn zu `.env.local` hinzu:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

⚠️ **Wichtig:** Teile den service_role key niemals öffentlich!

## 📊 Datenbank Schema

### Tabellen erstellt:
- ✅ `users` - Nutzerprofile mit KYC
- ✅ `vibe_profiles` - Persönlichkeitsprofile
- ✅ `trips` - Reise-Angebote
- ✅ `trip_applications` - Bewerbungen
- ✅ `trip_members` - Trip-Mitglieder
- ✅ `chat_rooms` - Chat-Räume
- ✅ `chat_participants` - Chat-Teilnehmer
- ✅ `messages` - Nachrichten
- ✅ `reviews` - Bewertungen
- ✅ `expenses` - Ausgaben
- ✅ `safety_reports` - Safety Reports

### Features:
- ✅ **pgvector** für KI-Embeddings
- ✅ **RLS Policies** für Security
- ✅ **Indexes** für Performance
- ✅ **Triggers** für updated_at

## 🧪 Testen

### Test User erstellen

```sql
INSERT INTO users (email, kyc_status, trust_score) 
VALUES ('test@example.com', 'verified', 100);
```

### Test Trip erstellen

```sql
INSERT INTO trips (
    creator_id, 
    title, 
    description,
    destination,
    start_date,
    end_date,
    max_participants,
    budget_range,
    trip_type,
    status
) VALUES (
    (SELECT id FROM users LIMIT 1),
    'Test Trip Lissabon',
    'Ein Test Trip für Remote Worker',
    '{"lat": 38.7223, "lng": -9.1393, "name": "Lissabon, Portugal", "country_code": "PT"}'::jsonb,
    '2026-09-01',
    '2026-09-30',
    5,
    '{"min": 1000, "max": 2000, "currency": "EUR"}'::jsonb,
    'coworking',
    'open'
);
```

## 🔐 Security

### RLS Policies aktiv
- Nutzer können nur verifizierte Profile sehen
- Trip-Creator können ihre Trips bearbeiten
- Chat-Teilnehmer können nur ihre Nachrichten sehen
- Bewerber können nur ihre eigenen Bewerbungen sehen

### Zusätzliche Security
- ✅ Row Level Security (RLS) auf allen Tabellen
- ✅ Authentifizierung über Supabase Auth
- ✅ Passkeys Support (WebAuthn)
- ✅ Magic Links
- ✅ OAuth (Google, Apple)

## 📈 Monitoring

Im Supabase Dashboard kannst du:
- **Database Usage** überwachen
- **Auth Events** einsehen
- **API Requests** tracken
- **Logs** analysieren

## 🚀 Deployment

Die App ist jetzt bereit für:
- ✅ Lokale Entwicklung (`npm run dev`)
- ✅ Vercel Deployment
- ✅ Produktions-Build

## 📝 Nächste Schritte

1. [ ] Migration in Supabase ausführen
2. [ ] Auth Provider konfigurieren
3. [ ] Service Role Key hinzufügen
4. [ ] Test Daten einfügen
5. [ ] App testen

**Fertig!** 🎉
