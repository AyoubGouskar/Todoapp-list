<template>
  <label
    :class="labelClass"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  error: false
})

const labelClass = computed(() => {
  return cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    {
      'text-red-600': props.error
    }
  )
})
</script>
