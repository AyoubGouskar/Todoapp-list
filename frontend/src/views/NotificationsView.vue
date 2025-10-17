<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
          <p class="text-gray-600 mt-1">Real-time notifications for your tasks</p>
        </div>
        
        <div class="p-6">
          <!-- Connection Status -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center">
              <div 
                class="w-3 h-3 rounded-full mr-3"
                :class="{
                  'bg-green-500': isConnected,
                  'bg-red-500': !isConnected
                }"
              ></div>
              <span class="text-sm font-medium text-blue-800">
                {{ isConnected ? 'Real-time connected' : 'Real-time disconnected' }}
              </span>
            </div>
          </div>

          <!-- Notifications List -->
          <div v-if="notifications.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-lg">No notifications yet</div>
            <p class="text-gray-500 mt-2">Create some tasks to see real-time notifications!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 border rounded-lg"
              :class="{
                'bg-green-50 border-green-200': notification.type === 'success',
                'bg-red-50 border-red-200': notification.type === 'error',
                'bg-blue-50 border-blue-200': notification.type === 'info',
                'bg-yellow-50 border-yellow-200': notification.type === 'warning'
              }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ formatTime(notification.timestamp) }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    v-if="!notification.read"
                    class="inline-block w-2 h-2 bg-blue-500 rounded-full"
                  ></span>
                  <button
                    v-if="!notification.read"
                    @click="markAsRead(notification.id)"
                    class="text-blue-400 hover:text-blue-600 text-xs"
                    title="Mark as read"
                  >
                    ✓
                  </button>
                  <button
                    @click="removeNotification(notification.id)"
                    class="text-gray-400 hover:text-gray-600"
                    title="Remove notification"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- Actions -->
          <div v-if="notifications.length > 0" class="mt-6 flex justify-between">
            <button
              @click="markAllAsRead"
              class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
            <button
              @click="clearAll"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useRealtime } from '@/composables/useRealtime'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const notificationsStore = useNotificationsStore()
const { isConnected } = useRealtime()

const notifications = computed(() => 
  notificationsStore.notifications.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  )
)

const markAsRead = (id: string) => {
  notificationsStore.markAsRead(id)
}

const removeNotification = (id: string) => {
  notificationsStore.removeNotification(id)
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const clearAll = () => {
  notificationsStore.clearAll()
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

</script>
