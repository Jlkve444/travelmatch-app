'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle } from 'lucide-react'

// Mock review data
const MOCK_REVIEWS = [
  {
    id: '1',
    reviewer: {
      name: 'Max',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    rating: 5,
    would_travel_again: true,
    comment: 'Lena ist eine fantastische Reisepartnerin! Super organisiert, kommunikativ und immer gut gelaunt. Wir hatten eine tolle Zeit in Portugal und ich würde jederzeit wieder mit ihr reisen.',
    created_at: '2026-03-10T14:30:00Z',
    trip: {
      title: '3 Wochen Remote Work in Lissabon',
      destination: 'Lissabon, Portugal',
    },
  },
  {
    id: '2',
    reviewer: {
      name: 'Sarah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    },
    rating: 5,
    would_travel_again: true,
    comment: 'Eine der besten Reiseerfahrungen! Lena hat alles perfekt organisiert und war super flexibel. Die Gruppendynamik war toll.',
    created_at: '2026-02-15T10:00:00Z',
    trip: {
      title: 'Bali Yoga Retreat',
      destination: 'Canggu, Bali',
    },
  },
  {
    id: '3',
    reviewer: {
      name: 'Tom',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    },
    rating: 4,
    would_travel_again: true,
    comment: 'Sehr angenehme Reisepartnerin. Organisiert und zuverlässig.',
    created_at: '2026-01-20T16:45:00Z',
    trip: {
      title: 'Kapstadt Adventure',
      destination: 'Kapstadt, Südafrika',
    },
  },
]

const USER_STATS = {
  total_reviews: 12,
  average_rating: 4.8,
  would_travel_again_percentage: 92,
  total_trips: 8,
}

function StarRating({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-amber text-amber' : 'text-soft-sand'
          }`}
        />
      ))}
    </div>
  )
}

export function ReviewSystem() {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    would_travel_again: true,
    comment: '',
  })

  const handleSubmitReview = () => {
    // Submit review logic here
    setShowReviewForm(false)
    setNewReview({ rating: 0, would_travel_again: true, comment: '' })
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card style={{ borderRadius: '24px' }}>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-ocean">{USER_STATS.total_reviews}</div>
              <div className="text-sm text-deep-ocean/60">Bewertungen</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-ocean flex items-center justify-center gap-1">
                {USER_STATS.average_rating}
                <Star className="w-6 h-6 fill-amber text-amber" />
              </div>
              <div className="text-sm text-deep-ocean/60">Durchschnitt</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-moss-green">
                {USER_STATS.would_travel_again_percentage}%
              </div>
              <div className="text-sm text-deep-ocean/60">Würden wieder reisen</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-ocean">{USER_STATS.total_trips}</div>
              <div className="text-sm text-deep-ocean/60">Abgeschlossene Trips</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-deep-ocean">Bewertungen</h2>
          
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-sunset-coral hover:bg-sunset-coral/90 text-white"
            style={{ borderRadius: '9999px' }}
          >
            Bewertung schreiben
          </Button>
        </div>

        {MOCK_REVIEWS.map((review) => (
          <Card key={review.id} style={{ borderRadius: '24px' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.reviewer.avatar} />
                  <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-deep-ocean">{review.reviewer.name}</h3>
                      <p className="text-sm text-deep-ocean/50">
                        {review.trip.title} • {review.trip.destination}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-deep-ocean/40">
                        {new Date(review.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>

                  <p className="text-deep-ocean/80 mt-3">{review.comment}</p>

                  {review.would_travel_again && (
                    <div className="flex items-center gap-2 mt-3 text-moss-green">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Würde wieder reisen</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg" style={{ borderRadius: '24px' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-deep-ocean">
                Bewertung schreiben
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Bewertung</label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          i < newReview.rating
                            ? 'fill-amber text-amber'
                            : 'text-soft-sand hover:text-amber/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Would travel again */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Würdest du wieder mit dieser Person reisen?</label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={newReview.would_travel_again ? 'default' : 'outline'}
                    onClick={() => setNewReview({ ...newReview, would_travel_again: true })}
                    className={`flex-1 h-12 ${
                      newReview.would_travel_again
                        ? 'bg-moss-green hover:bg-moss-green/90'
                        : 'border-soft-sand'
                    }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Ja
                  </Button>
                  
                  <Button
                    type="button"
                    variant={!newReview.would_travel_again ? 'default' : 'outline'}
                    onClick={() => setNewReview({ ...newReview, would_travel_again: false })}
                    className={`flex-1 h-12 ${
                      !newReview.would_travel_again
                        ? 'bg-sunset-coral hover:bg-sunset-coral/90'
                        : 'border-soft-sand'
                    }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <ThumbsDown className="w-5 h-5 mr-2" />
                    Nein
                  </Button>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-deep-ocean">Kommentar</label>
                <Textarea
                  placeholder="Teile deine Erfahrung..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="min-h-[120px]"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 h-12"
                  style={{ borderRadius: '9999px' }}
                >
                  Abbrechen
                </Button>
                
                <Button
                  onClick={handleSubmitReview}
                  disabled={newReview.rating === 0 || !newReview.comment}
                  className="flex-1 h-12 bg-sunset-coral hover:bg-sunset-coral/90 text-white"
                  style={{ borderRadius: '9999px' }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Absenden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
