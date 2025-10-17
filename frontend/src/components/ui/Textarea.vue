<template>
  <textarea
    :class="textareaClass"
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs"
  />
  
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  error: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaClass = computed(() => {
  return cn(
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
      'border-red-500 focus-visible:ring-red-500': props.error
    }
  )
})

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
