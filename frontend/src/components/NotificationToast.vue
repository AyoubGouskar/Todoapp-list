<template>
  <TransitionGroup
    name="notification"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-item"
      :class="{
        'bg-green-50 border-green-200 text-green-800': notification.type === 'success',
        'bg-red-50 border-red-200 text-red-800': notification.type === 'error',
        'bg-blue-50 border-blue-200 text-blue-800': notification.type === 'info',
        'bg-yellow-50 border-yellow-200 text-yellow-800': notification.type === 'warning'
      }"
    >
      <div class="flex items-start gap-3 p-4 border rounded-lg shadow-lg max-w-sm">
        <div class="flex-shrink-0">
          <component :is="getIcon(notification.type)" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium">{{ notification.title }}</h4>
          <p class="text-sm mt-1">{{ notification.message }}</p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const notificationsStore = useNotificationsStore()

const notifications = computed(() => 
  notificationsStore.recentNotifications.slice(0, 5)
)

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
}

const removeNotification = (id: string) => {
  notificationsStore.removeNotification(id)
}

// Auto-remove notifications after 15 seconds (increased from 10)
onMounted(() => {
  const interval = setInterval(() => {
    notifications.value.forEach(notification => {
      if (!notification.read && !notification.persistent) {
        setTimeout(() => {
          notificationsStore.removeNotification(notification.id)
        }, 15000) // Increased to 15 seconds
      }
    })
  }, 3000) // Check every 3 seconds instead of 2

  // Cleanup interval on unmount
  return () => clearInterval(interval)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
