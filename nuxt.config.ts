import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui', '@nuxt/icon', '@pinia/nuxt'],
  css: ['@/assets/main.css'],
  typescript: {
    strict: true,
    typeCheck: true,
  }
})