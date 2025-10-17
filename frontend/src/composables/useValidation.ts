import { ref, computed } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  email?: boolean
  phone?: boolean
  password?: boolean
  custom?: (value: any) => string | null
}

export interface ValidationErrors {
  [key: string]: string[]
}

export function useValidation() {
  const errors = ref<ValidationErrors>({})
  const isSubmitting = ref(false)

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const hasFieldError = (field: string) => computed(() => !!errors.value[field])

  const validateField = (field: string, value: any, rules: ValidationRule): string | null => {
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field} is required`
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }

    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `${field} must be at least ${rules.minLength} characters`
    }

    // Max length validation
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `${field} must be no more than ${rules.maxLength} characters`
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Phone validation
    if (rules.phone && typeof value === 'string') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number'
      }
    }

    // Password validation
    if (rules.password && typeof value === 'string') {
      if (value.length < 6) {
        return 'Password must be at least 6 characters'
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number'
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }

  const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): boolean => {
    errors.value = {}
    let isValid = true

    for (const [field, fieldRules] of Object.entries(rules)) {
      const error = validateField(field, data[field], fieldRules)
      if (error) {
        errors.value[field] = [error]
        isValid = false
      }
    }

    return isValid
  }

  const setFieldError = (field: string, message: string) => {
    errors.value[field] = [message]
  }

  const clearFieldError = (field: string) => {
    delete errors.value[field]
  }

  const clearAllErrors = () => {
    errors.value = {}
  }

  const getFieldError = (field: string): string | null => {
    return errors.value[field]?.[0] || null
  }

  return {
    errors,
    isSubmitting,
    hasErrors,
    hasFieldError,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldError
  }
}
