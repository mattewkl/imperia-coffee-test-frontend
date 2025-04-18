import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  // Если пользователь не авторизован и пытается зайти на защищенную страницу
  if (!auth.currentUser) {
    // Редиректим на страницу логина
    return navigateTo('/login')
  }
}) 