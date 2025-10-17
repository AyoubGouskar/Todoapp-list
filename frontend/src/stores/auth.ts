import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService'
import realtimeService from '@/services/realtime'

interface User {
  id: number
  full_name: string
  name: string
  email: string
  phone?: string
  address?: string
  image?: string
  image_url?: string
  created_at: string
  updated_at: string
}

interface RegisterData {
  full_name: string
  email: string
  phone?: string
  address?: string
  image?: string
  password: string
}

type RegisterDataInput = RegisterData | FormData

interface LoginData {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.full_name || user.value?.name || 'User')

  // Actions
  async function register(data: RegisterDataInput) {
    isLoading.value = true
    error.value = null

    try {
      const response = await AuthService.register(data)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      return { success: true, user: response.user }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function login(data: LoginData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await AuthService.login(data)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      
      // Initialize real-time connection after successful login
      realtimeService.initialize()
      
      return { success: true, user: response.user }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      await AuthService.logout()
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      
      // Disconnect real-time connection on logout
      realtimeService.disconnect()
      
      return { success: true }
    } catch (err: any) {
      // Even if logout fails on server, clear local state
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      
      // Disconnect real-time connection on logout
      realtimeService.disconnect()
      
      return { success: true }
    } finally {
      isLoading.value = false
    }
  }

  async function checkAuth() {
    if (!token.value) {
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      // You can add a /me endpoint call here to verify token
      // For now, we'll just check if token exists
      return true
    } catch (err: any) {
      error.value = 'Authentication failed'
      await logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state on store creation
  function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      // You could fetch user data here if needed
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    
    // Actions
    register,
    login,
    logout,
    checkAuth,
    clearError,
    initializeAuth
  }
})
