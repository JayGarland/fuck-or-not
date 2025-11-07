import type { ContentListUnion } from '@google/genai'
import type { ExtractedResponse, ParsedJsonResponse } from '~/types'
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai'
import { useDark, useStorage, useToggle } from '@vueuse/core'
import { ref, watch } from 'vue'

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const googleApiKey = useStorage('google-api-key', import.meta.env.VITE_GOOGLE_API_KEY || '')
const ai = ref<GoogleGenAI | null>(new GoogleGenAI({ apiKey: googleApiKey.value }))

watch(googleApiKey, (key) => {
  ai.value = key ? new GoogleGenAI({ apiKey: key }) : null
})

export function generateContent(model: string, contents: ContentListUnion, systemInstruction: string) {
  return ai.value!.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    },
  })
}

export function uploadFileToAPI(file: File) {
  return ai.value!.files.upload({
    file,
    config: {
      mimeType: file.type,
    },
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1])
      }
      reject(new Error('File reading failed'))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Extract and parse JSON from AI response text
 * Handles various JSON formats including code blocks
 */
export function extractJsonFromResponse(text: string): ExtractedResponse {
  const result: ExtractedResponse = {
    hasJson: false,
    jsonData: null,
    remainingText: text,
    rawText: text,
  }

  if (!text) {
    return result
  }

  // Try to find JSON in various formats
  const patterns = [
    // JSON code block with ```json
    /```json\s*(\{[\s\S]*?\})\s*```/i,
    // Plain code block with ```
    /```\s*(\{[\s\S]*?\})\s*```/,
    // Direct JSON object
    /(\{[\s\S]*?"verdict"[\s\S]*?\})/i,
    // Any JSON object
    /(\{[\s\S]*?\})/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      try {
        const jsonStr = match[1].trim()
        const parsed = JSON.parse(jsonStr) as ParsedJsonResponse

        // Validate that it has expected fields
        if (parsed.verdict || parsed.rating || parsed.explanation) {
          result.hasJson = true
          result.jsonData = parsed
          // Remove the JSON part from the text
          result.remainingText = text.replace(match[0], '').trim()
          break
        }
      }
      catch {
        // Continue to next pattern if parsing fails
        continue
      }
    }
  }

  return result
}
