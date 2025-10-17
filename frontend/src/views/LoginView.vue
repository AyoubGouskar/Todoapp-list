<template>
  <div class="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Or
        <router-link to="/register" class="font-medium text-primary hover:text-primary/80">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold text-center">Welcome back</h3>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="loginUser" class="space-y-6">
            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email" :error="!!getFieldError('email')">
                Email address
              </Label>
              <Input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                :error="!!getFieldError('email')"
                placeholder="Enter your email"
              />
              <p v-if="getFieldError('email')" class="text-sm text-destructive">
                {{ getFieldError('email') }}
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password" :error="!!getFieldError('password')">
                Password
              </Label>
              <Input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                :error="!!getFieldError('password')"
                placeholder="Enter your password"
              />
              <p v-if="getFieldError('password')" class="text-sm text-destructive">
                {{ getFieldError('password') }}
              </p>
            </div>

            <!-- Error Message -->
            <Alert v-if="authStore.error" variant="destructive">
              <AlertDescription>
                {{ authStore.error }}
              </AlertDescription>
            </Alert>

            <!-- Submit Button -->
            <Button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full"
            >
              {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div class="w-full">
            <Separator class="my-4" />
            <div class="text-center text-sm text-muted-foreground mb-4">
              New to Todo App?
            </div>
            <Button
              variant="outline"
              class="w-full"
              @click="$router.push('/register')"
            >
              Create an account
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useValidation } from '@/composables/useValidation'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Alert from '@/components/ui/Alert.vue'
import AlertDescription from '@/components/ui/AlertDescription.vue'
import Separator from '@/components/ui/Separator.vue'

const router = useRouter()
const authStore = useAuthStore()
const { validateForm, getFieldError, clearAllErrors } = useValidation()

const form = ref({
  email: '',
  password: ''
})

const validationRules = {
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 6
  }
}

const loginUser = async () => {
  clearAllErrors()
  
  // Validate form
  if (!validateForm(form.value, validationRules)) {
    return
  }
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    // Check for redirect query parameter
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/tasks')
  }
}
</script>
