# TravelMatch API Integration

## Übersicht

Die API Integration verbindet das React Frontend mit der Supabase PostgreSQL Datenbank. Alle API-Funktionen sind in `src/lib/api-integration.ts` und die React Hooks in `src/lib/hooks.ts`.

## 📁 Dateistruktur

```
src/lib/
├── supabase/
│   └── client.ts          # Supabase Client Konfiguration
├── api-integration.ts     # Alle API Funktionen
└── hooks.ts              # React Hooks für API
```

## 🚀 Schnellstart

### 1. Datenabfrage mit Hooks

```tsx
import { useTrips, useTrip, useCurrentUser } from '@/lib/hooks'

// Alle Trips laden
function TripFeed() {
  const { trips, loading, error } = useTrips()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}

// Einzelnen Trip laden
function TripDetail({ tripId }: { tripId: string }) {
  const { trip, loading, error } = useTrip(tripId)
  // ...
}

// Aktuellen User laden
function Profile() {
  const { user, loading } = useCurrentUser()
  // ...
}
```

### 2. Mutations mit API-Funktionen

```tsx
import { tripsApi, applicationsApi } from '@/lib/api-integration'

// Neuen Trip erstellen
async function createNewTrip() {
  try {
    const trip = await tripsApi.createTrip({
      title: 'Mein Trip',
      destination: { name: 'Lissabon', country_code: 'PT' },
      start_date: '2026-09-01',
      end_date: '2026-09-30',
      max_participants: 5,
      budget_range: { min: 1000, max: 2000, currency: 'EUR' },
      trip_type: 'coworking',
    })
    console.log('Trip erstellt:', trip)
  } catch (error) {
    console.error('Fehler:', error)
  }
}

// Auf Trip bewerben
async function applyToTrip(tripId: string) {
  try {
    const application = await applicationsApi.applyToTrip(tripId, {
      message: 'Ich würde gerne mitkommen!',
    })
    console.log('Bewerbung gesendet:', application)
  } catch (error) {
    console.error('Fehler:', error)
  }
}
```

### 3. Real-time Updates

```tsx
import { useMessages } from '@/lib/hooks'

function ChatRoom({ roomId }: { roomId: string }) {
  const { messages, loading, sendMessage } = useMessages(roomId)
  
  // Messages werden automatisch aktualisiert via WebSocket
  
  const handleSend = async (content: string) => {
    await sendMessage(content)
  }
  
  // ...
}
```

## 📚 API Referenz

### Trips API

```typescript
// Alle Trips laden
tripsApi.getTrips(filters?)

// Einzelnen Trip laden
tripsApi.getTrip(id)

// Trip erstellen
tripsApi.createTrip(trip)

// Trip aktualisieren
tripsApi.updateTrip(id, updates)

// Trip schließen
tripsApi.closeTrip(id)

// Trip löschen
tripsApi.deleteTrip(id)
```

### Applications API

```typescript
// Auf Trip bewerben
applicationsApi.applyToTrip(tripId, application)

// Bewerbungen für Trip laden
applicationsApi.getApplications(tripId)

// Meine Bewerbungen laden
applicationsApi.getMyApplications()

// Bewerbung akzeptieren/ablehnen
applicationsApi.updateStatus(id, 'accepted' | 'rejected')

// Bewerbung zurückziehen
applicationsApi.withdraw(id)
```

### Users API

```typescript
// Aktuellen User laden
usersApi.getCurrentUser()

// User laden
usersApi.getUser(id)

// Profil aktualisieren
usersApi.updateProfile(updates)

// Vibe Profile aktualisieren
usersApi.updateVibeProfile(profile)
```

### Chat API

```typescript
// Chat Rooms laden
chatApi.getChatRooms()

// Nachrichten laden
chatApi.getMessages(roomId)

// Nachricht senden
chatApi.sendMessage(roomId, content, type)

// Chat Room erstellen
chatApi.createTripChat(tripId, name)
```

### Reviews API

```typescript
// Reviews für User laden
reviewsApi.getUserReviews(userId)

// Review erstellen
reviewsApi.createReview(review)
```

### Auth API

```typescript
// Mit Email anmelden
authApi.signIn(email, password)

// Mit OAuth anmelden
authApi.signInWithOAuth('google' | 'apple')

// Abmelden
authApi.signOut()

// Session laden
authApi.getSession()
```

## 🔄 React Hooks

### Data Fetching Hooks

- `useTrips(filters?)` - Alle Trips
- `useTrip(id)` - Einzelner Trip
- `useApplications(tripId)` - Bewerbungen für Trip
- `useMyApplications()` - Meine Bewerbungen
- `useCurrentUser()` - Aktueller User
- `useUser(id)` - User nach ID
- `useChatRooms()` - Chat Rooms
- `useMessages(roomId)` - Nachrichten (mit Real-time)
- `useReviews(userId)` - Reviews

### Auth Hooks

- `useAuth()` - Auth Status und Funktionen

### Utility Hooks

- `useLoadingState()` - Loading State Management
- `useRealtimeTrips(callback)` - Real-time Trip Updates

## 🔌 Real-time Subscriptions

Die App nutzt Supabase Realtime für Live-Updates:

### Automatisch in Hooks:
- `useMessages()` - Neue Nachrichten in Echtzeit
- `useApplications()` - Neue Bewerbungen in Echtzeit

### Manuelle Subscriptions:
```typescript
import { realtimeApi } from '@/lib/api-integration'

const subscription = realtimeApi.subscribeToMessages(roomId, (message) => {
  console.log('Neue Nachricht:', message)
})

// Cleanup
subscription.unsubscribe()
```

## 🛡️ Error Handling

Alle API-Funktionen werfen Fehler bei Fehlschlagen:

```typescript
try {
  const trip = await tripsApi.getTrip('invalid-id')
} catch (error) {
  if (error.message.includes('not found')) {
    // Trip nicht gefunden
  } else {
    // Anderer Fehler
  }
}
```

## 🔐 Authentifizierung

Die meisten API-Funktionen erfordern Authentifizierung:

```typescript
// User muss eingeloggt sein
const { user } = await supabase.auth.getUser()
if (!user) {
  throw new Error('Not authenticated')
}
```

## 📊 Typen

Alle Typen sind in `src/lib/supabase/client.ts` definiert:

```typescript
import type { Trip, User, Message, TripApplication } from '@/lib/supabase/client'
```

## 🧪 Testing

### Mock Daten verwenden:

```typescript
// In development kannst du Mock Daten verwenden
const mockTrips = [
  {
    id: '1',
    title: 'Test Trip',
    // ...
  }
]
```

### API Mocking:

```typescript
jest.mock('@/lib/api-integration', () => ({
  tripsApi: {
    getTrips: jest.fn().mockResolvedValue(mockTrips),
  }
}))
```

## 📝 Best Practices

1. **Immer Hooks verwenden** für Data Fetching
2. **Error Handling** nicht vergessen
3. **Loading States** berücksichtigen
4. **Cleanup** bei Unmount (Hooks machen das automatisch)
5. **Optimistic Updates** für bessere UX

## 🚀 Performance

- **Automatic Caching**: Supabase Client cached Anfragen
- **Realtime**: Nur notwendige Daten werden über WebSocket gesendet
- **Pagination**: Für große Listen (noch zu implementieren)

## 📞 Support

Bei Problemen:
1. Browser Console checken
2. Supabase Dashboard checken (Logs)
3. Network Tab in DevTools checken

---

**Letzte Aktualisierung:** 19. März 2026
