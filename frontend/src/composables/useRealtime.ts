import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import realtimeService from '@/services/realtime'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useConnectionStore } from '@/stores/connection'

export function useRealtime() {
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()
  const connectionStore = useConnectionStore()
  
  // Use the connection store for reactive status
  const isConnected = computed(() => connectionStore.isConnected)
  const connectionState = computed(() => connectionStore.connectionState)

  /**
   * Update connection status
   */
  const updateConnectionStatus = async () => {
    const newConnected = realtimeService.isConnected()
    const newState = realtimeService.getConnectionState()
    
    // Update the connection store directly
    connectionStore.updateStatus(newConnected, newState)
  }

  /**
   * Initialize real-time connection
   */
  const initialize = () => {
    if (authStore.isAuthenticated) {
      realtimeService.initialize()
      
      // Set up a periodic status check
      const statusInterval = setInterval(() => {
        updateConnectionStatus()
      }, 1000)
      
      // Store interval ID for cleanup
      ;(realtimeService as any).statusInterval = statusInterval
      
      updateConnectionStatus()
    }
  }

  /**
   * Disconnect real-time connection
   */
  const disconnect = () => {
    realtimeService.disconnect()
    
    // Clear status interval
    if ((realtimeService as any).statusInterval) {
      clearInterval((realtimeService as any).statusInterval)
      ;(realtimeService as any).statusInterval = null
    }
    
    updateConnectionStatus()
  }

  /**
   * Reconnect real-time connection
   */
  const reconnect = () => {
    realtimeService.reconnect()
    updateConnectionStatus()
  }

  /**
   * Force re-subscribe to tasks channel
   */
  const resubscribeToTasks = () => {
    realtimeService.resubscribeToTasks()
  }

  /**
   * Manually set up event listeners
   */
  const setupTaskEventListeners = () => {
    return realtimeService.setupTaskEventListeners()
  }

  /**
   * Subscribe to a channel
   */
  const subscribe = (channelName: string) => {
    return realtimeService.subscribe(channelName)
  }

  /**
   * Subscribe to a private channel
   */
  const subscribePrivate = (channelName: string) => {
    return realtimeService.subscribePrivate(channelName)
  }

  /**
   * Subscribe to a presence channel
   */
  const subscribePresence = (channelName: string) => {
    return realtimeService.subscribePresence(channelName)
  }

  // Watch for auth status changes
  watch(() => authStore.isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      // User just logged in
      initialize()
    } else if (!newAuthStatus && oldAuthStatus) {
      // User just logged out
      disconnect()
    }
  })

  // Auto-initialize when component mounts and user is authenticated
  onMounted(() => {
    realtimeService.addReference()
    if (authStore.isAuthenticated) {
      initialize()
    } else {
      // Still update status even if not authenticated
      updateConnectionStatus()
    }
  })

  // Auto-disconnect when component unmounts (but only if no other components are using it)
  onUnmounted(() => {
    // Clear status interval
    if ((realtimeService as any).statusInterval) {
      clearInterval((realtimeService as any).statusInterval)
      ;(realtimeService as any).statusInterval = null
    }
    
    realtimeService.removeReference()
  })

  return {
    isConnected,
    connectionState,
    initialize,
    disconnect,
    reconnect,
    resubscribeToTasks,
    setupTaskEventListeners,
    subscribe,
    subscribePrivate,
    subscribePresence,
    updateConnectionStatus
  }
}

/**
 * Composable for listening to specific real-time events
 */
export function useRealtimeEvents() {
  const { subscribe } = useRealtime()

  /**
   * Listen for task creation events
   */
  const onTaskCreated = (callback: (task: any) => void) => {
    const channel = subscribe('tasks')
    if (channel) {
      channel.listen('TaskCreated', callback)
    }
    return channel
  }

  /**
   * Listen for task updates
   */
  const onTaskUpdated = (callback: (task: any) => void) => {
    const channel = subscribe('tasks')
    if (channel) {
      channel.listen('TaskUpdated', callback)
    }
    return channel
  }

  /**
   * Listen for task deletions
   */
  const onTaskDeleted = (callback: (taskId: number) => void) => {
    const channel = subscribe('tasks')
    if (channel) {
      channel.listen('TaskDeleted', callback)
    }
    return channel
  }

  return {
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted
  }
}
