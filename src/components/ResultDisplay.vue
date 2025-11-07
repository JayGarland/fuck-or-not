<script setup lang="ts">
import type { ExtractedResponse } from '~/types'

defineProps<{
  extractedData: ExtractedResponse
  size?: 'large' | 'normal'
}>()
</script>

<template>
  <!-- Structured JSON Display -->
  <div v-if="extractedData.hasJson && extractedData.jsonData" space-y-4>
    <!-- Verdict - Largest -->
    <div v-if="extractedData.jsonData.verdict" flex items-center justify-center>
      <span
        :class="[
          extractedData.jsonData.verdict === 'SMASH' ? 'text-green-500 animate-pulse' : 'text-red-500',
          size === 'large' ? 'text-5xl' : 'text-4xl',
        ]"
        font-black tracking-wide
        drop-shadow-lg
      >
        {{ extractedData.jsonData.verdict === 'SMASH' ? '🔥 操！' : '❌ 不操！' }}
      </span>
    </div>

    <!-- Rating - Medium -->
    <div v-if="extractedData.jsonData.rating !== undefined" flex flex-col items-center gap-2>
      <span
        :class="[
          {
            'text-red-500': extractedData.jsonData.rating <= 2,
            'text-orange-500': extractedData.jsonData.rating >= 3 && extractedData.jsonData.rating <= 4,
            'text-yellow-500': extractedData.jsonData.rating >= 5 && extractedData.jsonData.rating <= 6,
            'text-lime-500': extractedData.jsonData.rating >= 7 && extractedData.jsonData.rating <= 8,
            'text-green-500': extractedData.jsonData.rating >= 9,
          },
          size === 'large' ? 'text-4xl' : 'text-3xl',
        ]"
        font-bold flex items-center gap-2
        drop-shadow-md
      >
        <span v-if="extractedData.jsonData.rating <= 2" :class="size === 'large' ? 'text-4xl' : 'text-3xl'">🤮</span>
        <span v-else-if="extractedData.jsonData.rating >= 3 && extractedData.jsonData.rating <= 4" :class="size === 'large' ? 'text-4xl' : 'text-3xl'">😒</span>
        <span v-else-if="extractedData.jsonData.rating >= 5 && extractedData.jsonData.rating <= 6" :class="size === 'large' ? 'text-4xl' : 'text-3xl'">😐</span>
        <span v-else-if="extractedData.jsonData.rating >= 7 && extractedData.jsonData.rating <= 8" :class="size === 'large' ? 'text-4xl' : 'text-3xl'">😏</span>
        <span v-else-if="extractedData.jsonData.rating >= 9" :class="size === 'large' ? 'text-4xl' : 'text-3xl'">🥵</span>
        {{ extractedData.jsonData.rating }}/10
      </span>
      <span
        v-if="extractedData.jsonData.rating <= 2"
        :class="size === 'large' ? 'text-base' : 'text-sm'"
        opacity-90 font-semibold text-red-400
      >
        完全不想碰，恶心透顶
      </span>
      <span
        v-else-if="extractedData.jsonData.rating >= 3 && extractedData.jsonData.rating <= 4"
        :class="size === 'large' ? 'text-base' : 'text-sm'"
        opacity-90 font-semibold text-orange-400
      >
        勉强能操，但缺点太多
      </span>
      <span
        v-else-if="extractedData.jsonData.rating >= 5 && extractedData.jsonData.rating <= 6"
        :class="size === 'large' ? 'text-base' : 'text-sm'"
        opacity-90 font-semibold text-yellow-400
      >
        中等吸引力，有点性感但不刺激
      </span>
      <span
        v-else-if="extractedData.jsonData.rating >= 7 && extractedData.jsonData.rating <= 8"
        :class="size === 'large' ? 'text-base' : 'text-sm'"
        opacity-90 font-semibold text-lime-400
      >
        挺性感，但没到立刻想操
      </span>
      <span
        v-else-if="extractedData.jsonData.rating >= 9"
        :class="size === 'large' ? 'text-base' : 'text-sm'"
        opacity-90 font-semibold text-green-400
      >
        立刻就想操
      </span>
    </div>

    <!-- Explanation - Smaller -->
    <div v-if="extractedData.jsonData.explanation" border-t="2 base" pt-3 mt-2>
      <p
        :class="size === 'large' ? 'text-lg' : 'text-base'"
        whitespace-pre-wrap leading-relaxed text-center font-medium opacity-95
      >
        {{ extractedData.jsonData.explanation }}
      </p>
    </div>

    <!-- Show remaining text if any -->
    <div v-if="extractedData.remainingText" border-t="2 base" pt-3 mt-2>
      <p
        :class="size === 'large' ? 'text-lg' : 'text-base'"
        whitespace-pre-wrap leading-relaxed opacity-90
        :text="size === 'large' ? 'center' : 'left'"
      >
        {{ extractedData.remainingText }}
      </p>
    </div>
  </div>

  <!-- Fallback: Show raw text if no JSON found -->
  <div v-else whitespace-pre-wrap>
    {{ extractedData.rawText }}
  </div>
</template>
