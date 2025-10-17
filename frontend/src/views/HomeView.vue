<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Todo App
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          A modern full-stack todo application with real-time notifications
        </p>
        
        <div class="flex justify-center space-x-4">
          <router-link
            to="/login"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple home page component
</script>