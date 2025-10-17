<template>
  <div
    :class="separatorClass"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true
})

const separatorClass = computed(() => {
  return cn(
    'shrink-0 bg-border',
    {
      'h-[1px] w-full': props.orientation === 'horizontal',
      'h-full w-[1px]': props.orientation === 'vertical'
    }
  )
})
</script>
