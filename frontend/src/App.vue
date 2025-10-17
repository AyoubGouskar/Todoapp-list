<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotificationToast from './components/NotificationToast.vue'
import RealtimeStatus from './components/RealtimeStatus.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Notification Toasts -->
    <NotificationToast />
    
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <RouterLink to="/" class="text-xl font-bold text-gray-900">
              Todo App
            </RouterLink>
          </div>
          
          <!-- Navigation for authenticated users -->
          <nav v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <RouterLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </RouterLink>
            <RouterLink 
              to="/tasks" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tasks
            </RouterLink>
            <RouterLink 
              to="/notifications" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Notifications
            </RouterLink>
          </nav>
          
          <!-- Navigation for non-authenticated users -->
          <nav v-else class="flex items-center space-x-4">
            <RouterLink 
              to="/login" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Register
            </RouterLink>
          </nav>
          
          <div class="flex items-center space-x-4">
            <!-- User info and logout for authenticated users -->
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
              <div class="flex items-center space-x-3">
                <img
                  v-if="authStore.user?.image_url"
                  :src="authStore.user.image_url"
                  :alt="authStore.userName"
                  class="h-8 w-8 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600">
                  Welcome, {{ authStore.userName }}
                </span>
              </div>
              <button
                @click="handleLogout"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
            
            <!-- Real-time status -->
            <RealtimeStatus />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

