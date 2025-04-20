<template>
  <UContainer class="py-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Личный кабинет</h1>
      <UButton
        color="red"
        @click="handleLogout"
        icon="i-heroicons-arrow-right-on-rectangle"
      >
        Выход
      </UButton>
    </div>
    <UCard>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="font-medium text-gray-500">Имя</div>
            <div>{{ currentUser?.name }}</div>
          </div>
          <div>
            <div class="font-medium text-gray-500">Фамилия</div>
            <div>{{ currentUser?.surname }}</div>
          </div>
          <div>
            <div class="font-medium text-gray-500">Логин</div>
            <div>{{ currentUser?.credentials.username }}</div>
          </div>
          <div>
            <div class="font-medium text-gray-500">Статус</div>
            <UBadge
              :color="currentUser?.active ? 'green' : 'red'"
              :label="currentUser?.active ? 'Активен' : 'Неактивен'"
            />
          </div>
          <div>
            <div class="font-medium text-gray-500">Дата создания</div>
            <div>{{ currentUser?.created }}</div>
          </div>
        </div>
      </div>
    </UCard>
    <CoffeeTable />
  </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'nuxt/app'
import { computed } from 'vue'

// Добавляем защиту страницы
// @ts-ignore - классика автоимпортов
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script> 