<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const cardClass = computed(() => {
  return cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    {
      'border-border': props.variant === 'default' || props.variant === 'outline'
    }
  )
})
</script>
