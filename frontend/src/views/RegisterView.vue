<template>
  <div class="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        Or
        <router-link to="/login" class="font-medium text-primary hover:text-primary/80">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardHeader>
          <h3 class="text-lg font-semibold text-center">Join Todo App</h3>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="registerUser" enctype="multipart/form-data" class="space-y-6">
            <!-- Full Name Field -->
            <div class="space-y-2">
              <Label for="full_name" :error="!!getFieldError('full_name')">
                Full Name
              </Label>
              <Input
                id="full_name"
                v-model="form.full_name"
                name="full_name"
                type="text"
                autocomplete="name"
                required
                :error="!!getFieldError('full_name')"
                placeholder="Enter your full name"
              />
              <p v-if="getFieldError('full_name')" class="text-sm text-destructive">
                {{ getFieldError('full_name') }}
              </p>
            </div>

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

            <!-- Phone Field -->
            <div class="space-y-2">
              <Label for="phone" :error="!!getFieldError('phone')">
                Phone Number
              </Label>
              <Input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                :error="!!getFieldError('phone')"
                placeholder="Enter your phone number (optional)"
              />
              <p v-if="getFieldError('phone')" class="text-sm text-destructive">
                {{ getFieldError('phone') }}
              </p>
            </div>

            <!-- Address Field -->
            <div class="space-y-2">
              <Label for="address" :error="!!getFieldError('address')">
                Address
              </Label>
              <Input
                id="address"
                v-model="form.address"
                name="address"
                type="text"
                autocomplete="street-address"
                :error="!!getFieldError('address')"
                placeholder="Enter your address (optional)"
              />
              <p v-if="getFieldError('address')" class="text-sm text-destructive">
                {{ getFieldError('address') }}
              </p>
            </div>

          <!-- Profile Image Field -->
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div class="mt-1">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Profile preview"
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <input
                    id="image"
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 2MB
                  </p>
                  <p v-if="getFieldError('image')" class="mt-1 text-sm text-red-600">
                    {{ getFieldError('image') }}
                  </p>
                </div>
              </div>
            </div>
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
                autocomplete="new-password"
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
              {{ authStore.isLoading ? 'Creating account...' : 'Create account' }}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div class="w-full">
            <Separator class="my-4" />
            <div class="text-center text-sm text-muted-foreground mb-4">
              Already have an account?
            </div>
            <Button
              variant="outline"
              class="w-full"
              @click="$router.push('/login')"
            >
              Sign in
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
const fileInput = ref<HTMLInputElement>()
const { validateForm, getFieldError, clearAllErrors, setFieldError } = useValidation()

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  image: null as File | null
})

const imagePreview = ref<string | null>(null)

const validationRules = {
  full_name: {
    required: true,
    minLength: 2,
    maxLength: 255
  },
  email: {
    required: true,
    email: true,
    maxLength: 255
  },
  phone: {
    phone: true,
    maxLength: 20
  },
  address: {
    maxLength: 255
  },
  password: {
    required: true,
    password: true,
    minLength: 6
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setFieldError('image', 'Image size must be less than 2MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFieldError('image', 'Please select a valid image file')
      return
    }
    
    form.value.image = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const registerUser = async () => {
  clearAllErrors()
  
  // Validate form
  if (!validateForm(form.value, validationRules)) {
    return
  }
  
  // Create FormData for file upload
  const formData = new FormData()
  formData.append('full_name', form.value.full_name)
  formData.append('email', form.value.email)
  formData.append('phone', form.value.phone || '')
  formData.append('address', form.value.address || '')
  formData.append('password', form.value.password)
  
  if (form.value.image) {
    formData.append('image', form.value.image)
  }
  
  const result = await authStore.register(formData)
  
  if (result.success) {
    // Check for redirect query parameter
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/tasks')
  }
}
</script>
