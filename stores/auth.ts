import { defineStore } from 'pinia'
import type { User } from '~/types'
import users from '~/users.json'

// Имитация API ответа
interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    loginError: ''
  }),
  
  actions: {
    async login(username: string, password: string) {
      // Имитируем API запрос
      const response = await this.mockApiCall({ username, password })
      
      if (response.success && response.user) {
        this.currentUser = response.user
        this.loginError = ''
        return true
      }
      
      this.loginError = response.error || 'Введены неверные данные авторизации. Попробуйте ещё раз'
      return false
    },

    logout() {
      this.currentUser = null
    },

    // Приватный метод для имитации API
    async mockApiCall(credentials: { username: string, password: string }): Promise<AuthResponse> {
      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 700))

      console.log('Trying to login with:', credentials)

      // Имитируем проверку на сервере
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

      // Проверяем пароль (здесь одинаковые ошибки чтобы не говорить потенциальному взломщику чи шо)
      if (!user._comment.includes(`паролем '${credentials.password}'`)) {
        return {
          success: false,
          error: 'Неверный логин или пароль'
        }
      }

      // Имитируем успешный ответ
      return {
        success: true,
        user
      }
    }
  }
}) 