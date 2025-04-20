import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const isAuthenticated = await auth.checkAuth()  
  if (!isAuthenticated) {
    return navigateTo('/login')
  }
}) 