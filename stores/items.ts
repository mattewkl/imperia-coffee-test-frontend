// Store для работы с данными таблицы
// Методы получения данных
// Методы фильтрации 

import { defineStore } from 'pinia'
import type { CoffeeItem } from '~/types'

interface FilterOptions {
  dateRange?: {
    start: string
    end: string
  }
  category?: 'hot' | 'cold' | 'seasonal'
  status?: 'available' | 'unavailable'
  isSeasonalOffer?: boolean
  search?: string
}

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [] as CoffeeItem[],
    loading: false,
    error: null as string | null,
    filters: {
      dateRange: undefined,
      category: undefined,
      status: undefined,
      isSeasonalOffer: undefined,
      search: undefined
    } as FilterOptions
  }),

  getters: {
    // Получение отфильтрованных элементов
    filteredItems: (state) => {
      let result = [...state.items]

      // Фильтрация по дате
      if (state.filters.dateRange) {
        result = result.filter(item => {
          const itemDate = new Date(item.date_created)
          const start = new Date(state.filters.dateRange!.start)
          const end = new Date(state.filters.dateRange!.end)
          return itemDate >= start && itemDate <= end
        })
      }

      // Фильтрация по категории
      if (state.filters.category) {
        result = result.filter(item => item.category === state.filters.category)
      }

      // Фильтрация по статусу
      if (state.filters.status) {
        result = result.filter(item => item.status === state.filters.status)
      }

      // Фильтрация по сезонности
      if (state.filters.isSeasonalOffer !== undefined) {
        result = result.filter(item => item.isSeasonalOffer === state.filters.isSeasonalOffer)
      }

      // Поиск по названию
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        )
      }

      return result
    },

    // Получение уникальных категорий для фильтра
    availableCategories: (state) => {
      return [...new Set(state.items.map(item => item.category))]
    }
  },

  actions: {
    //  Ну типа Загрузка данных
    async fetchItems() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/items')
        const data = await response.json()
        this.items = data
      } catch (err) {
        console.error('Error fetching items:', err)
      } finally {
        this.loading = false
      }
    },

    // Установка фильтров
    setFilters(filters: Partial<FilterOptions>) {
      this.filters = {
        ...this.filters,
        ...filters
      }
    },

    // Сброс фильтров
    resetFilters() {
      this.filters = {
        dateRange: undefined,
        category: undefined,
        status: undefined,
        isSeasonalOffer: undefined,
        search: undefined
      }
    },

    // Получение напитка по ID
    getItemById(id: number): CoffeeItem | undefined {
      return this.items.find(item => item.id === id)
    }
  }
}) 