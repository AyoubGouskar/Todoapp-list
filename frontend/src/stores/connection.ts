import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', () => {
  const isConnected = ref(false)
  const connectionState = ref('disconnected')
  const lastUpdate = ref(Date.now())

  function updateStatus(connected: boolean, state: string) {
    isConnected.value = connected
    connectionState.value = state
    lastUpdate.value = Date.now()
  }

  function getStatusText() {
    if (isConnected.value) {
      return 'Real-time connected'
    }
    
    switch (connectionState.value) {
      case 'connecting':
        return 'Connecting...'
      case 'disconnected':
        return 'Disconnected'
      case 'failed':
        return 'Connection failed'
      default:
        return 'Unknown status'
    }
  }

  return {
    isConnected,
    connectionState,
    lastUpdate,
    updateStatus,
    getStatusText
  }
})
