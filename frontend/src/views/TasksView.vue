<template>
  <div class="min-h-screen bg-background py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">My Tasks</h1>
        <p class="text-muted-foreground mt-2">Manage your tasks and stay organized</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="p-2 bg-primary/10 rounded-lg">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p class="text-2xl font-semibold text-foreground">{{ tasksStore.tasksCount }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-muted-foreground">Completed</p>
                <p class="text-2xl font-semibold text-foreground">{{ tasksStore.completedCount }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-muted-foreground">Pending</p>
                <p class="text-2xl font-semibold text-foreground">{{ tasksStore.pendingCount }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Add Task Form -->
      <Card class="mb-8">
        <CardHeader>
          <h2 class="text-lg font-semibold">Add New Task</h2>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="addTask" class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input
                id="title"
                v-model="newTask.title"
                type="text"
                required
                placeholder="Enter task title"
              />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                v-model="newTask.description"
                rows="3"
                placeholder="Enter task description (optional)"
              />
            </div>
            <div class="flex justify-end">
              <Button
                type="submit"
                :disabled="tasksStore.isCreating"
              >
                {{ tasksStore.isCreating ? 'Adding...' : 'Add Task' }}
              </Button>
            </div>
    </form>
        </CardContent>
      </Card>


      <!-- Tasks List -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-900">All Tasks</h2>
                <div class="flex space-x-2">
                  <button
                    @click="loadTasks"
                    :disabled="tasksStore.isLoading"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    {{ tasksStore.isLoading ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>
          </div>

          <!-- Loading State -->
          <div v-if="tasksStore.isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Loading tasks...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="tasksStore.tasksCount === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          </div>

          <!-- Tasks List -->
          <div v-else class="space-y-4">
            <div
              v-for="task in tasksStore.tasks"
              :key="task.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-4">
                <button
                  @click="toggleTask(task.id)"
                  :disabled="tasksStore.isUpdating"
                  class="flex-shrink-0"
                >
                  <div
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    :class="{
                      'bg-green-500 border-green-500': task.is_completed,
                      'border-gray-300 hover:border-green-500': !task.is_completed
                    }"
                  >
                    <svg
                      v-if="task.is_completed"
                      class="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </button>
                <div class="flex-1">
                  <h3
                    class="text-sm font-medium"
                    :class="{
                      'text-gray-900': !task.is_completed,
                      'text-gray-500 line-through': task.is_completed
                    }"
                  >
                    {{ task.title }}
                  </h3>
                  <p
                    v-if="task.description"
                    class="text-sm"
                    :class="{
                      'text-gray-600': !task.is_completed,
                      'text-gray-400 line-through': task.is_completed
                    }"
                  >
                    {{ task.description }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Created {{ formatDate(task.created_at) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editTask(task)"
                  :disabled="tasksStore.isUpdating"
                  class="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit task"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteTask(task.id)"
                  :disabled="tasksStore.isDeleting"
                  class="text-red-600 hover:text-red-800 p-1"
                  title="Delete task"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-if="tasksStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <p class="mt-1 text-sm text-red-700">{{ tasksStore.error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Task Modal -->
      <div v-if="editingTask" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Task</h3>
              <button
                @click="cancelEdit"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="saveEdit" class="space-y-4">
              <div class="space-y-2">
                <Label for="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  v-model="editForm.title"
                  type="text"
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div class="space-y-2">
                <Label for="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  v-model="editForm.description"
                  rows="3"
                  placeholder="Enter task description (optional)"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  @click="cancelEdit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  :disabled="tasksStore.isUpdating"
                >
                  {{ tasksStore.isUpdating ? 'Saving...' : 'Save Changes' }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useRealtime } from '@/composables/useRealtime'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Label from '@/components/ui/Label.vue'
import Badge from '@/components/ui/Badge.vue'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const { initialize } = useRealtime()

const newTask = ref({
  title: '',
  description: ''
})

const editingTask = ref<any>(null)
const editForm = ref({
  title: '',
  description: ''
})

const loadTasks = async () => {
  await tasksStore.fetchTasks()
}

const addTask = async () => {
  if (!newTask.value.title.trim()) return
  
  const taskTitle = newTask.value.title // Store the title before API call
  
  const result = await tasksStore.createTask({
    title: newTask.value.title,
    description: newTask.value.description
  })
  
  if (result.success) {
    // Add a manual notification for testing
    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      notificationsStore.addSuccess(
        'Task Created',
        `Task "${taskTitle}" has been created successfully!`,
        { task: result.task },
        true // Make it persistent
      )
    })
    
    newTask.value.title = ''
    newTask.value.description = ''
  }
}


const editTask = (task: any) => {
  editingTask.value = task
  editForm.value = {
    title: task.title,
    description: task.description || ''
  }
}

const saveEdit = async () => {
  if (!editForm.value.title.trim()) return
  
  const taskTitle = editForm.value.title // Store the title before API call
  
  const result = await tasksStore.updateTask(editingTask.value.id, {
    title: editForm.value.title,
    description: editForm.value.description
  })
  
  if (result.success) {
    // Add a manual notification for testing
    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      notificationsStore.addInfo(
        'Task Updated',
        `Task "${taskTitle}" has been updated successfully!`,
        { task: result.task },
        true // Make it persistent
      )
    })
    
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingTask.value = null
  editForm.value = {
    title: '',
    description: ''
  }
}

const toggleTask = async (id: number) => {
  // Get task info before toggle for notification
  const taskToToggle = tasksStore.tasks.find(t => t.id === id)
  const taskTitle = taskToToggle?.title || 'Unknown Task'
  const currentStatus = taskToToggle?.is_completed || false
  
  const result = await tasksStore.toggleTask(id)
  
  if (result.success) {
    // Add a manual notification for testing
    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      const newStatus = !currentStatus
      notificationsStore.addInfo(
        'Task Status Updated',
        `Task "${taskTitle}" has been ${newStatus ? 'completed' : 'marked as pending'}!`,
        { task: result.task },
        true // Make it persistent
      )
    })
  }
}

const deleteTask = async (id: number) => {
  if (confirm('Are you sure you want to delete this task?')) {
    // Get task info before deletion for notification
    const taskToDelete = tasksStore.tasks.find(t => t.id === id)
    const taskTitle = taskToDelete?.title || 'Unknown Task'
    
    const result = await tasksStore.deleteTask(id)
    
    if (result.success) {
      // Add a manual notification for testing
      import('@/stores/notifications').then(({ useNotificationsStore }) => {
        const notificationsStore = useNotificationsStore()
        notificationsStore.addWarning(
          'Task Deleted',
          `Task "${taskTitle}" has been deleted successfully!`,
          { task_id: id, task_title: taskTitle },
          true // Make it persistent
        )
      })
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadTasks()
    // Initialize real-time connection for this page
    initialize()
  }
})
</script>
