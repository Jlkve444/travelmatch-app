'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Link as LinkIcon,
  Plus,
  ExternalLink,
  GripVertical,
  CheckCircle2,
  Users
} from 'lucide-react'

// Mock itinerary data
const MOCK_ITINERARY = [
  {
    id: '1',
    day: 1,
    date: '2026-09-12',
    items: [
      {
        id: 'i1',
        time: '14:00',
        title: 'Ankunft in Lissabon',
        description: 'Flug LH1234, Ankunft am Flughafen LIS',
        type: 'transport',
        links: [],
        completed: true,
        assigned_to: ['1', '2', '3'],
      },
      {
        id: 'i2',
        time: '16:00',
        title: 'Check-in Airbnb',
        description: 'Rua da Prata 45, Lissabon',
        type: 'accommodation',
        links: [
          { title: 'Airbnb', url: 'https://airbnb.com/...' },
        ],
        completed: true,
        assigned_to: ['1', '2', '3'],
      },
      {
        id: 'i3',
        time: '19:00',
        title: 'Willkommensdinner',
        description: 'Time Out Market - Street Food',
        type: 'food',
        links: [
          { title: 'Time Out Market', url: 'https://timeoutmarket.com' },
        ],
        completed: false,
        assigned_to: ['1', '2', '3'],
      },
    ],
  },
  {
    id: '2',
    day: 2,
    date: '2026-09-13',
    items: [
      {
        id: 'i4',
        time: '09:00',
        title: 'Coworking Space',
        description: 'Selina Coworking - Tag 1',
        type: 'coworking',
        links: [
          { title: 'Selina', url: 'https://selina.com' },
        ],
        completed: false,
        assigned_to: ['1', '2'],
      },
      {
        id: 'i5',
        time: '13:00',
        title: 'Mittagspause',
        description: 'Pasteis de Nata tasting',
        type: 'food',
        links: [],
        completed: false,
        assigned_to: ['1', '2', '3'],
      },
      {
        id: 'i6',
        time: '15:00',
        title: 'Surfing Lesson',
        description: 'Carcavelos Beach - Anfänger Kurs',
        type: 'activity',
        links: [
          { title: 'Surf School', url: 'https://surflisbon.com' },
        ],
        completed: false,
        assigned_to: ['2', '3'],
      },
    ],
  },
  {
    id: '3',
    day: 3,
    date: '2026-09-14',
    items: [
      {
        id: 'i7',
        time: '10:00',
        title: 'Sintra Tagestrip',
        description: 'Pena Palace und Sintra Altstadt',
        type: 'activity',
        links: [
          { title: 'Pena Palace Tickets', url: 'https://parquesdesintra.pt' },
        ],
        completed: false,
        assigned_to: ['1', '2', '3'],
      },
    ],
  },
]

const TRIP_MEMBERS = [
  { id: '1', name: 'Lena', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', color: 'bg-sunset-coral' },
  { id: '2', name: 'Max', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', color: 'bg-moss-green' },
  { id: '3', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', color: 'bg-amber' },
]

const TYPE_ICONS: Record<string, string> = {
  transport: '✈️',
  accommodation: '🏠',
  food: '🍽️',
  activity: '🎯',
  coworking: '💻',
}

const TYPE_LABELS: Record<string, string> = {
  transport: 'Transport',
  accommodation: 'Unterkunft',
  food: 'Essen',
  activity: 'Aktivität',
  coworking: 'Coworking',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function CollaborativeItinerary() {
  const [itinerary, setItinerary] = useState(MOCK_ITINERARY)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)
  const [newItem, setNewItem] = useState({
    time: '',
    title: '',
    description: '',
    type: 'activity',
    links: '',
  })

  const toggleComplete = (dayId: string, itemId: string) => {
    setItinerary(itinerary.map(day => ({
      ...day,
      items: day.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    })))
  }

  const handleAddItem = () => {
    if (!newItem.time || !newItem.title) return

    const day = itinerary.find(d => d.day === selectedDay)
    if (!day) return

    const item = {
      id: `i${Date.now()}`,
      time: newItem.time,
      title: newItem.title,
      description: newItem.description,
      type: newItem.type,
      links: newItem.links ? [{ title: 'Link', url: newItem.links }] : [],
      completed: false,
      assigned_to: TRIP_MEMBERS.map(m => m.id),
    }

    setItinerary(itinerary.map(d =>
      d.day === selectedDay ? { ...d, items: [...d.items, item] } : d
    ))

    setShowAddForm(false)
    setNewItem({ time: '', title: '', description: '', type: 'activity', links: '' })
  }

  const completedCount = itinerary.reduce((sum, day) => 
    sum + day.items.filter(i => i.completed).length, 0
  )
  const totalCount = itinerary.reduce((sum, day) => sum + day.items.length, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card style={{ borderRadius: '24px' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-deep-ocean">Reiseplan</h2>
              <p className="text-deep-ocean/60">
                {completedCount} von {totalCount} Aktivitäten erledigt
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-soft-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-moss-green rounded-full transition-all"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-deep-ocean">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Days */}
      <div className="space-y-6">
        {itinerary.map((day) => (
          <Card key={day.id} style={{ borderRadius: '24px' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sunset-coral/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-sunset-coral" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-deep-ocean">
                      Tag {day.day}
                    </CardTitle>
                    <p className="text-sm text-deep-ocean/60">{formatDate(day.date)}</p>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDay(day.day)
                    setShowAddForm(true)
                  }}
                  className="border-soft-sand"
                  style={{ borderRadius: '9999px' }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Hinzufügen
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {day.items.length === 0 ? (
                <div className="text-center py-8 text-deep-ocean/40">
                  Noch keine Aktivitäten geplant
                </div>
              ) : (
                day.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      item.completed
                        ? 'bg-moss-green/5 border-moss-green/20'
                        : 'bg-white border-soft-sand hover:border-sunset-coral/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(day.id, item.id)}
                        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-moss-green border-moss-green'
                            : 'border-soft-sand hover:border-moss-green'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{TYPE_ICONS[item.type]}</span>
                              <h4 className={`font-semibold text-deep-ocean ${
                                item.completed ? 'line-through opacity-60' : ''
                              }`}>
                                {item.title}
                              </h4>
                            </div>
                            
                            <p className="text-sm text-deep-ocean/60 mt-1">{item.description}</p>

                            {/* Links */}
                            {item.links.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.links.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-sunset-coral hover:underline"
                                  >
                                    <LinkIcon className="w-3 h-3" />
                                    {link.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 text-deep-ocean/60">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{item.time}</span>
                            </div>
                            
                            <Badge variant="secondary" className="mt-2" style={{ borderRadius: '9999px' }}>
                              {TYPE_LABELS[item.type]}
                            </Badge>
                          </div>
                        </div>

                        {/* Assigned Members */}
                        <div className="flex items-center gap-2 mt-3">
                          <Users className="w-4 h-4 text-deep-ocean/40" />
                          <div className="flex -space-x-2">
                            {item.assigned_to.map((userId) => {
                              const member = TRIP_MEMBERS.find(m => m.id === userId)
                              return member ? (
                                <div
                                  key={userId}
                                  className={`w-7 h-7 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                                  title={member.name}
                                >
                                  {member.name[0]}
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md" style={{ borderRadius: '24px' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-deep-ocean">
                Aktivität hinzufügen - Tag {selectedDay}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Uhrzeit</label>
                <Input
                  type="time"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Titel</label>
                <Input
                  placeholder="z.B. Besuch Pena Palace"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Beschreibung</label>
                <Input
                  placeholder="Optionale Details..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Typ</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <Button
                      key={key}
                      type="button"
                      variant={newItem.type === key ? 'default' : 'outline'}
                      onClick={() => setNewItem({ ...newItem, type: key })}
                      className={`h-12 ${
                        newItem.type === key
                          ? 'bg-sunset-coral text-white border-sunset-coral'
                          : 'border-soft-sand'
                      }`}
                      style={{ borderRadius: '12px' }}
                    >
                      <span className="mr-2">{TYPE_ICONS[key]}</span>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Link (optional)</label>
                <Input
                  placeholder="https://..."
                  value={newItem.links}
                  onChange={(e) => setNewItem({ ...newItem, links: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 h-12"
                  style={{ borderRadius: '9999px' }}
                >
                  Abbrechen
                </Button>
                
                <Button
                  onClick={handleAddItem}
                  disabled={!newItem.time || !newItem.title}
                  className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                  style={{ borderRadius: '9999px' }}
                >
                  Hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
