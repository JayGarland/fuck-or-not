<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  maxSize?: number
}>(), {
  maxSize: 20,
})
const emit = defineEmits<{
  uploaded: [file: File]
  error: [message: string]
}>()

const imageModel = ref<HTMLImageElement>()

const modelValue = defineModel<File | null>()
const fileInput = ref<HTMLInputElement>()
const isEmpty = computed(() => !modelValue.value)
const previewUrl = ref<string>()
const dragCounter = ref(0)
const isDragOver = computed(() => dragCounter.value > 0)

async function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await handleFileSelect(file)
  }
  // maybe should not remove image
  else if (false) {
    removeImage()
  }
}

async function handleFileSelect(file: File) {
  if (!file.type.startsWith('image/')) {
    emit('error', '请选择图片格式')
    return
  }

  const maxSizeInBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    emit('error', `图片大小不能超过 ${props.maxSize}MB`)
    return
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  try {
    previewUrl.value = URL.createObjectURL(file)
    await loadImage(previewUrl.value)
    modelValue.value = file
    await uploadFile(file) // Await the file upload process
    emit('uploaded', file)
  }
  catch {
    emit('error', 'Failed to load or upload the image. Please try again.')
  }
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Image failed to load'))
    img.src = src
  })
}

async function uploadFile(file: File): Promise<void> {
  try {
    // Simulate an upload process (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('File uploaded successfully:', file.name)
  }
  catch {
    throw new Error('File upload failed')
  }
}

function removeImage() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = undefined
  }
  modelValue.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleClick() {
  fileInput.value?.click()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

function handlePreview() {
  if (previewUrl.value) {
    const img = new window.Image()
    img.src = previewUrl.value
    img.alt = 'preview image'
    img.className = 'preview image-uploader'
    document.body.appendChild(img)
    img.click()
    document.body.removeChild(img)
  }
}
</script>

<template>
  <div
    border="2 base hover-base rounded-md"
    :class="[
      isEmpty
        ? 'border-dashed'
        : 'border-solid',
      isDragOver ? '!border-teal-600 !dark:border-teal-700' : '',
    ]"
    min-h-50 w-full cursor-pointer relative overflow-hidden
    @click="handleClick"
    @drop="handleDrop"
    @dragleave.prevent.stop="dragCounter--"
    @dragenter.prevent.stop="dragCounter++"
    @dragover.prevent.stop
  >
    <input
      ref="fileInput" accept="image/*" type="file" hidden
      @change="handleInputChange"
    >

    <div
      v-show="isEmpty && !isDragOver"
      flex="~ col items-center justify-center"
      opacity-60
      h-full min-h-50
    >
      <div i-carbon-add-large text-2xl />
    </div>

    <div
      v-show="isEmpty && isDragOver"
      flex="~ col items-center justify-center"
      bg="light dark:dark"
      opacity-60 h-full min-h-50 transition duration-200
    >
      <div i-carbon-document-add text-2xl />
    </div>

    <div
      v-show="!isEmpty"
      flex="~ col items-center justify-center relative"
    >
      <img
        ref="imageModel" :src="previewUrl"
        rounded max-h-100 max-w-full object-contain block
      >

      <!-- preview button -->
      <button
        absolute top-2 right-2 z-10 p-1
        border="rounded-full" transition
        hover="bg-dark/20 dark:bg-light/20"
        cursor-pointer
        title="preview image"
        @click.stop="handlePreview"
      >
        <div i-stash-expand-diagonal-duotone text-2xl text-teal-700 />
      </button>
    </div>
  </div>
</template>
