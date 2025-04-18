<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md sm:max-w-lg md:max-w-xl">
      <template #header>
        <h2 class="text-2xl font-bold text-center">Вход в систему</h2>
      </template>

      <UForm 
        :validate="validate"
        class="space-y-6"
        autocomplete="fuckuchrome"
      >
        <UFormField 
          label="Логин"
          name="fuckingshitoffuckingdirt"
          :validate="validateEmail"
          class="w-full"
        >
          <template #help>
            <p v-if="emailError" class="text-red-500 text-sm">
              {{ emailError }}
            </p>
          </template>
          <UInput
            v-model="form.username"
            type="email"
            autocomplete="off"
            placeholder="Введите логин"
            @blur="validateAndShowEmailError"
            class="w-full"
          >
            <template v-if="form.username?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="form.username = ''"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField 
          label="Пароль"
          :name="passwordFieldId"
          :validate="validatePassword"
          class="w-full"
        >
          <template #help>
            <p v-if="passwordError" class="text-red-500 text-sm">
              {{ passwordError }}
            </p>
          </template>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Введите пароль"
            @blur="validateAndShowPasswordError"
            class="w-full"
          >
            <template #trailing>
              <div class="flex gap-1">
                <UButton
                  v-if="form.password?.length"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  aria-label="Clear input"
                  @click="form.password = ''"
                />
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                />
              </div>
            </template>
          </UInput>
        </UFormField>

        <UAlert
          v-if="error"
          type="danger"
          :title="error"
        />

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          Войти
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const error = ref('')
const loading = ref(false)
const passwordFieldId = 'password'
const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)

// Валидация email
function validateEmail(value: string) {
  if (!value) return 'Email обязателен'
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(value)) return 'Некорректный email'
  return true
}

// Валидация пароля
function validatePassword(value: string) {
  if (!value) return 'Пароль обязателен'
  if (value.length < 8) return 'Пароль должен быть не менее 8 символов'
  return true
}

// Валидация всей формы
const validate = async () => {
  const errors = []
  const emailValidation = validateEmail(form.username)
  const passwordValidation = validatePassword(form.password)
  
  if (emailValidation !== true) errors.push(emailValidation)
  if (passwordValidation !== true) errors.push(passwordValidation)
  
  if (errors.length) return errors

  loading.value = true
  error.value = ''
  
  try {
    const success = await auth.login(form.username, form.password)
    if (success) {
      await router.push('/account')
    } else {
      error.value = auth.loginError
    }
  } catch (e) {
    error.value = 'Произошла ошибка при входе в систему'
  } finally {
    loading.value = false
  }
  
  return true
}

function validateAndShowEmailError() {
  const result = validateEmail(form.username)
  emailError.value = result === true ? '' : result
}

function validateAndShowPasswordError() {
  const result = validatePassword(form.password)
  passwordError.value = result === true ? '' : result
}

</script> 