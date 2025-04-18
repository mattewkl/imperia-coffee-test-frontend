import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  
  // Проверяем аутентификацию по passphrase в куках
  const isAuthenticated = await auth.checkAuth()
  
  // Если не аутентифицированы - редирект на логин
  if (!isAuthenticated) {
    return navigateTo('/login')
  }
}) 