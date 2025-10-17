<template>
  <div class="realtime-status">
    <div class="flex items-center gap-2">
      <div 
        class="w-3 h-3 rounded-full"
        :class="{
          'bg-green-500': isConnected,
          'bg-red-500': !isConnected,
          'bg-yellow-500': connectionState === 'connecting'
        }"
      ></div>
      <span class="text-sm text-gray-600">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConnectionStore } from '@/stores/connection'

const connectionStore = useConnectionStore()

const isConnected = computed(() => connectionStore.isConnected)
const connectionState = computed(() => connectionStore.connectionState)
const statusText = computed(() => connectionStore.getStatusText())
</script>

<style scoped>
.realtime-status {
  @apply p-2 bg-gray-50 rounded-lg;
}
</style>
