import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { useNotificationsStore } from '@/stores/notifications'

/**
 * Composable to access all stores in one place
 * This provides a convenient way to access multiple stores
 */
export function useStores() {
  const authStore = useAuthStore()
  const tasksStore = useTasksStore()
  const notificationsStore = useNotificationsStore()

  return {
    auth: authStore,
    tasks: tasksStore,
    notifications: notificationsStore
  }
}

/**
 * Individual store composables for more specific use cases
 */
export function useAuth() {
  return useAuthStore()
}

export function useTasks() {
  return useTasksStore()
}

export function useNotifications() {
  return useNotificationsStore()
}
