import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  persistent?: boolean // If true, won't auto-remove
  data?: any // Additional data for the notification
}

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  // Getters
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )
  
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )
  
  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  )

  // Actions
  function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      persistent: notification.persistent || false // Default to false
    }
    
    notifications.value.unshift(newNotification)
    
    // Keep only last 50 notifications to prevent memory issues
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  function clearRead() {
    notifications.value = notifications.value.filter(n => !n.read)
  }

  // Helper methods for different notification types
  function addSuccess(title: string, message: string, data?: any, persistent: boolean = false) {
    addNotification({ type: 'success', title, message, data, persistent })
  }

  function addError(title: string, message: string, data?: any, persistent: boolean = false) {
    addNotification({ type: 'error', title, message, data, persistent })
  }

  function addInfo(title: string, message: string, data?: any, persistent: boolean = false) {
    addNotification({ type: 'info', title, message, data, persistent })
  }

  function addWarning(title: string, message: string, data?: any, persistent: boolean = false) {
    addNotification({ type: 'warning', title, message, data, persistent })
  }

  // Real-time connection status
  function setConnectionStatus(connected: boolean, error?: string) {
    isConnected.value = connected
    connectionError.value = error || null
  }

  // Handle task creation notifications
  function handleTaskCreated(task: any) {
    addSuccess(
      'New Task Created',
      `Task "${task.title}" has been created successfully!`,
      { task }
    )
  }

  return {
    // State
    notifications,
    isConnected,
    connectionError,
    
    // Getters
    unreadCount,
    unreadNotifications,
    recentNotifications,
    
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
    
    // Helper methods
    addSuccess,
    addError,
    addInfo,
    addWarning,
    setConnectionStatus,
    handleTaskCreated
  }
})
