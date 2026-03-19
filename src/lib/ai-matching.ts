// AI Vibe Matching Service - OpenAI Embeddings + Cosine Similarity
// OpenAI client for vibe embeddings
// Note: Install with: npm install openai

interface OpenAIClient {
  embeddings: {
    create: (params: { model: string; input: string | string[]; dimensions?: number }) => Promise<{
      data: Array<{ embedding: number[] }>
    }>
  }
}

// Mock OpenAI client - replace with actual implementation
const openai: OpenAIClient = {
  embeddings: {
    create: async ({ input }) => {
      // Return mock embeddings for now
      const inputArray = Array.isArray(input) ? input : [input]
      return {
        data: inputArray.map(() => ({
          embedding: Array(256).fill(0).map(() => Math.random() * 2 - 1)
        }))
      }
    }
  }
}

// Embedding Model: text-embedding-3-large with 256 dimensions
const EMBEDDING_MODEL = 'text-embedding-3-large'
const EMBEDDING_DIMENSIONS = 256

export interface VibeProfile {
  bio_text: string
  travel_style_tags: string[]
  budget_preference: 'budget' | 'moderate' | 'luxury'
  flexibility: 'rigid' | 'flexible' | 'spontaneous'
  activity_level: 'relaxed' | 'moderate' | 'active'
  social_preference: 'introvert' | 'ambivert' | 'extrovert'
  early_bird: boolean
  digital_nomad: boolean
  languages: string[]
}

export interface MatchResult {
  userId: string
  matchScore: number // 0-100
  compatibilityBreakdown: {
    vibeSimilarity: number // Cosine similarity of embeddings
    travelStyle: number // Tag overlap
    schedule: number // Early bird compatibility
    activity: number // Activity level match
    social: number // Social preference match
  }
  reasons: string[] // Human-readable match reasons
}

/**
 * Generate embedding vector from vibe profile
 * Combines all profile fields into a descriptive text for embedding
 */
export async function generateVibeEmbedding(profile: VibeProfile): Promise<number[]> {
  const vibeText = `
    Travel style: ${profile.travel_style_tags.join(', ')}.
    Budget: ${profile.budget_preference}.
    Flexibility: ${profile.flexibility}.
    Activity level: ${profile.activity_level}.
    Social preference: ${profile.social_preference}.
    ${profile.early_bird ? 'Early bird' : 'Night owl'}.
    ${profile.digital_nomad ? 'Digital nomad who works while traveling' : 'Traveling for leisure'}.
    Languages: ${profile.languages.join(', ')}.
    Bio: ${profile.bio_text}
  `.trim()

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: vibeText,
    dimensions: EMBEDDING_DIMENSIONS,
  })

  return response.data[0].embedding
}

/**
 * Calculate cosine similarity between two embedding vectors
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Calculate travel style compatibility based on tag overlap
 */
function calculateTravelStyleCompatibility(
  tagsA: string[],
  tagsB: string[]
): number {
  if (tagsA.length === 0 || tagsB.length === 0) return 50

  const intersection = tagsA.filter(tag => tagsB.includes(tag))
  const union = [...new Set([...tagsA, ...tagsB])]
  
  // Jaccard similarity * 100
  return Math.round((intersection.length / union.length) * 100)
}

/**
 * Calculate schedule compatibility (early bird vs night owl)
 */
function calculateScheduleCompatibility(
  earlyBirdA: boolean,
  earlyBirdB: boolean
): number {
  return earlyBirdA === earlyBirdB ? 100 : 40
}

/**
 * Calculate activity level compatibility
 */
function calculateActivityCompatibility(
  levelA: string,
  levelB: string
): number {
  const levels = ['relaxed', 'moderate', 'active']
  const indexA = levels.indexOf(levelA)
  const indexB = levels.indexOf(levelB)
  const diff = Math.abs(indexA - indexB)
  
  // 0 diff = 100%, 1 diff = 70%, 2 diff = 40%
  return Math.max(100 - diff * 30, 40)
}

/**
 * Calculate social preference compatibility
 */
function calculateSocialCompatibility(
  socialA: string,
  socialB: string
): number {
  const socials = ['introvert', 'ambivert', 'extrovert']
  const indexA = socials.indexOf(socialA)
  const indexB = socials.indexOf(socialB)
  const diff = Math.abs(indexA - indexB)
  
  // Ambiverts match well with everyone
  if (socialA === 'ambivert' || socialB === 'ambivert') {
    return 90
  }
  
  // Same = 100%, adjacent = 70%, opposite = 30%
  return diff === 0 ? 100 : diff === 1 ? 70 : 30
}

/**
 * Generate human-readable match reasons
 */
function generateMatchReasons(
  profileA: VibeProfile,
  profileB: VibeProfile,
  breakdown: MatchResult['compatibilityBreakdown']
): string[] {
  const reasons: string[] = []

  // Vibe similarity
  if (breakdown.vibeSimilarity > 80) {
    reasons.push('Eure Reisevibes sind sehr ähnlich')
  } else if (breakdown.vibeSimilarity > 60) {
    reasons.push('Ihr habt komplementäre Reisestile')
  }

  // Travel style overlap
  const commonTags = profileA.travel_style_tags.filter(tag =>
    profileB.travel_style_tags.includes(tag)
  )
  if (commonTags.length > 0) {
    reasons.push(`Gemeinsame Interessen: ${commonTags.slice(0, 2).join(', ')}`)
  }

  // Schedule
  if (profileA.early_bird === profileB.early_bird) {
    reasons.push(profileA.early_bird 
      ? 'Ihr beide seht früh auf 🌅' 
      : 'Ihr beide seid Nachteulen 🌙'
    )
  }

  // Digital nomad
  if (profileA.digital_nomad && profileB.digital_nomad) {
    reasons.push('Beide Digital Nomads - perfekt für Coworking! 💻')
  }

  // Activity level
  if (breakdown.activity > 80) {
    reasons.push('Gleicher Aktivitätslevel')
  }

  // Languages
  const commonLangs = profileA.languages.filter(lang =>
    profileB.languages.includes(lang)
  )
  if (commonLangs.length > 0) {
    reasons.push(`Sprachen gemeinsam: ${commonLangs.join(', ')}`)
  }

  return reasons.slice(0, 3) // Max 3 reasons
}

/**
 * Calculate overall match score between two users
 */
export function calculateMatchScore(
  profileA: VibeProfile,
  profileB: VibeProfile,
  embeddingA: number[],
  embeddingB: number[]
): MatchResult {
  // Calculate all compatibility factors
  const vibeSimilarity = Math.round(
    ((cosineSimilarity(embeddingA, embeddingB) + 1) / 2) * 100
  ) // Normalize to 0-100

  const travelStyle = calculateTravelStyleCompatibility(
    profileA.travel_style_tags,
    profileB.travel_style_tags
  )

  const schedule = calculateScheduleCompatibility(
    profileA.early_bird,
    profileB.early_bird
  )

  const activity = calculateActivityCompatibility(
    profileA.activity_level,
    profileB.activity_level
  )

  const social = calculateSocialCompatibility(
    profileA.social_preference,
    profileB.social_preference
  )

  // Weighted average for overall score
  const weights = {
    vibe: 0.35,      // Most important - AI embedding similarity
    travelStyle: 0.25,
    schedule: 0.15,
    activity: 0.15,
    social: 0.10,
  }

  const matchScore = Math.round(
    vibeSimilarity * weights.vibe +
    travelStyle * weights.travelStyle +
    schedule * weights.schedule +
    activity * weights.activity +
    social * weights.social
  )

  const breakdown = {
    vibeSimilarity,
    travelStyle,
    schedule,
    activity,
    social,
  }

  return {
    userId: '', // Will be set by caller
    matchScore,
    compatibilityBreakdown: breakdown,
    reasons: generateMatchReasons(profileA, profileB, breakdown),
  }
}

/**
 * Find best matches for a user from a pool of candidates
 */
export async function findBestMatches(
  userProfile: VibeProfile,
  userEmbedding: number[],
  candidates: Array<{
    id: string
    profile: VibeProfile
    embedding: number[]
  }>,
  options: {
    minScore?: number
    maxResults?: number
  } = {}
): Promise<MatchResult[]> {
  const { minScore = 50, maxResults = 10 } = options

  const matches = candidates
    .filter(candidate => candidate.id !== '') // Exclude self
    .map(candidate => {
      const match = calculateMatchScore(
        userProfile,
        candidate.profile,
        userEmbedding,
        candidate.embedding
      )
      match.userId = candidate.id
      return match
    })
    .filter(match => match.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults)

  return matches
}

/**
 * Get match quality label
 */
export function getMatchQualityLabel(score: number): {
  label: string
  color: string
  emoji: string
} {
  if (score >= 90) {
    return { label: 'Perfect Match', color: '#7A9E7E', emoji: '✨' }
  } else if (score >= 75) {
    return { label: 'Great Match', color: '#7A9E7E', emoji: '🔥' }
  } else if (score >= 60) {
    return { label: 'Good Match', color: '#D4A373', emoji: '👍' }
  } else if (score >= 45) {
    return { label: 'Possible Match', color: '#E86A53', emoji: '🤔' }
  } else {
    return { label: 'Low Match', color: '#9CA3AF', emoji: '💤' }
  }
}

/**
 * Batch generate embeddings for multiple profiles
 */
export async function batchGenerateEmbeddings(
  profiles: VibeProfile[]
): Promise<number[][]> {
  const texts = profiles.map(profile => `
    Travel style: ${profile.travel_style_tags.join(', ')}.
    Budget: ${profile.budget_preference}.
    Flexibility: ${profile.flexibility}.
    Activity level: ${profile.activity_level}.
    Social preference: ${profile.social_preference}.
    ${profile.early_bird ? 'Early bird' : 'Night owl'}.
    ${profile.digital_nomad ? 'Digital nomad who works while traveling' : 'Traveling for leisure'}.
    Languages: ${profile.languages.join(', ')}.
    Bio: ${profile.bio_text}
  `.trim())

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    dimensions: EMBEDDING_DIMENSIONS,
  })

  return response.data.map((d: { embedding: number[] }) => d.embedding)
}
