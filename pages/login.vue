<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold text-center">Вход в систему</h2>
      </template>

      <UForm 
        :validate="validate"
        class="space-y-4"
        autocomplete="fuckuchrome"
      >
        <UFormField 
          label="Логин"
          name="fuckingshitoffuckingdirt"
          :validate="validateEmail"
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
        >
          <template #help>
            <p v-if="passwordError" class="text-red-500 text-sm">
              {{ passwordError }}
            </p>
          </template>
          <UInput
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            placeholder="Введите пароль"
            @blur="validateAndShowPasswordError"
          >
            <template v-if="form.password?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="form.password = ''"
              />
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

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const error = ref('')
const loading = ref(false)
const passwordFieldId = 'password'
const emailError = ref('')
const passwordError = ref('')

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
  if (!/[A-Z]/.test(value)) return 'Пароль должен содержать хотя бы одну заглавную букву'
  if (!/[a-z]/.test(value)) return 'Пароль должен содержать хотя бы одну строчную букву'
  if (!/[0-9]/.test(value)) return 'Пароль должен содержать хотя бы одну цифру'
  return true
}

// Валидация всей формы
const validate = () => {
  const errors = []
  const emailValidation = validateEmail(form.username)
  const passwordValidation = validatePassword(form.password)
  
  if (emailValidation !== true) errors.push(emailValidation)
  if (passwordValidation !== true) errors.push(passwordValidation)
  
  return errors.length ? errors : true
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