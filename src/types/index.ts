export interface FavoriteResult {
  model: string
  mode: 'concise' | 'detailed' | 'novel' | 'custom'
  image: string
  time: number
  result: string
}

export interface ParsedJsonResponse {
  verdict?: 'SMASH' | 'PASS'
  rating?: number
  explanation?: string
}

export interface ExtractedResponse {
  hasJson: boolean
  jsonData: ParsedJsonResponse | null
  remainingText: string
  rawText: string
}
