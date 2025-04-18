import { defineStore } from 'pinia'
import type { User } from '~/types'
import users from '~/users.json'

// ВАЖНО: Это демонстрационное решение для примера!
// В реальном приложении аутентификация должна быть реализована
// на стороне сервера с использованием безопасных механизмов
// (например, JWT tokens, сессии и т.д.)

interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  passphrase?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    loginError: ''
  }),
  
  actions: {
    async login(username: string, password: string) {
      const response = await this.mockApiCall({ username, password })
      
      if (response.success && response.user && response.passphrase) {
        this.currentUser = response.user
        this.loginError = ''
        
        // Сохраняем passphrase в куки на 30 дней
        const cookie = useCookie('auth-passphrase', { maxAge: 30 * 24 * 60 * 60 })
        cookie.value = response.passphrase
        
        return true
      }
      
      this.loginError = response.error || 'Введены неверные данные авторизации. Попробуйте ещё раз'
      return false
    },

    logout() {
      this.currentUser = null
      // Удаляем passphrase из куков при выходе
      const cookie = useCookie('auth-passphrase')
      cookie.value = null
    },

    // Проверка аутентификации по passphrase из куков
    async checkAuth() {
      const cookie = useCookie('auth-passphrase')
      if (!cookie.value) return false

      // Имитируем проверку passphrase на сервере
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const user = users.find(u => 
        // В реальности здесь была бы проверка passphrase на сервере
        // Для демо используем простую связь passphrase = username
        u.credentials.username === cookie.value && 
        u.active === true
      )

      if (user) {
        this.currentUser = user
        return true
      }

      // Если passphrase невалидна - очищаем
      cookie.value = null
      return false
    },

    // Приватный метод для имитации API
    async mockApiCall(credentials: { username: string, password: string }): Promise<AuthResponse> {
      await new Promise(resolve => setTimeout(resolve, 700))

      const user = users.find(u => 
        u.credentials.username === credentials.username && 
        u.active === true
      )

      if (!user) {
        return {
          success: false,
          error: 'Неверный логин или пароль'
        }
      }

      if (!user._comment.includes(`паролем '${credentials.password}'`)) {
        return {
          success: false,
          error: 'Неверный логин или пароль'
        }
      }

      // В демо-версии используем username как passphrase
      // В реальном приложении здесь генерировался бы случайный токен
      return {
        success: true,
        user,
        passphrase: user.credentials.username
      }
    }
  }
}) 