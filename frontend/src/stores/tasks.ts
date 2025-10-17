import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import TaskService from '@/services/TaskService'

interface Task {
  id: number
  user_id: number
  title: string
  description?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

interface CreateTaskData {
  title: string
  description?: string
}

interface UpdateTaskData {
  title?: string
  description?: string
  is_completed?: boolean
}

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // Getters
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.is_completed)
  )
  
  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.is_completed)
  )
  
  const tasksCount = computed(() => tasks.value.length)
  const completedCount = computed(() => completedTasks.value.length)
  const pendingCount = computed(() => pendingTasks.value.length)

  // Actions
  async function fetchTasks() {
    isLoading.value = true
    error.value = null

    try {
      const response = await TaskService.getAllTasks()
      tasks.value = response
      return { success: true, tasks: response }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(data: CreateTaskData) {
    isCreating.value = true
    error.value = null

    try {
      const response = await TaskService.createTask(data)
      tasks.value.unshift(response.task) // Add to beginning of array
      return { success: true, task: response.task }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      return { success: false, error: error.value }
    } finally {
      isCreating.value = false
    }
  }

  async function updateTask(id: number, data: UpdateTaskData) {
    isUpdating.value = true
    error.value = null

    try {
      const response = await TaskService.updateTask(id, data)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.task
      }
      return { success: true, task: response.task }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      return { success: false, error: error.value }
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteTask(id: number) {
    isDeleting.value = true
    error.value = null

    try {
      await TaskService.deleteTask(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      return { success: false, error: error.value }
    } finally {
      isDeleting.value = false
    }
  }

  async function toggleTask(id: number) {
    isUpdating.value = true
    error.value = null

    try {
      const response = await TaskService.toggleTaskCompletion(id)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.task
      }
      return { success: true, task: response.task }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle task'
      return { success: false, error: error.value }
    } finally {
      isUpdating.value = false
    }
  }

  async function getTask(id: number) {
    try {
      const response = await TaskService.getTask(id)
      return { success: true, task: response }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch task'
      return { success: false, error: error.value }
    }
  }

  function clearError() {
    error.value = null
  }

  function clearTasks() {
    tasks.value = []
  }

  // Helper function to add task from real-time notifications
  function addTaskFromNotification(task: Task) {
    // Check if task already exists to avoid duplicates
    const existingTask = tasks.value.find(t => t.id === task.id)
    if (!existingTask) {
      tasks.value.unshift(task)
    }
  }

  return {
    // State
    tasks,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Getters
    completedTasks,
    pendingTasks,
    tasksCount,
    completedCount,
    pendingCount,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTask,
    clearError,
    clearTasks,
    addTaskFromNotification
  }
})
