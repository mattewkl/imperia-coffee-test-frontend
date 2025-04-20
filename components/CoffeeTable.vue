<template>
  <div>
    <!-- Блок фильтров -->
    <UCard class="mb-4">
      <template #header>
        <div class="text-xl font-medium">Фильтры</div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Поиск -->
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Поиск по названию..."
          @input="handleSearch"
        />

        <!-- Фильтр категорий -->
        <USelect
          v-model="selectedCategory"
          :items="[{
            label: 'Горячие напитки',
            value: 'hot'
          }, {
            label: 'Холодные напитки',
            value: 'cold'
          }, {
            label: 'Сезонные напитки',
            value: 'seasonal'
          }]"
          placeholder="Выберите категорию"
          @update:modelValue="handleCategoryChange"
        >
          
        </USelect>


      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-arrow-path"
            label="Сбросить фильтры"
            @click="resetAllFilters"
          />
        </div>
      </template>
    </UCard>

    <!-- Таблица -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">Меню кофейни</h3>
          <UBadge
            :label="`Всего позиций: ${filteredItems.length}`"
            color="secondary"
            variant="subtle"
          />
        </div>
      </template>

      <UTable
        v-if="!loading && filteredItems"
        :data="filteredItems"
        :ui="{
          tbody: '[&>tr>td]:max-w-[300px] [&>tr>td:nth-child(6)]:min-w-[300px] [&>tr>td:nth-child(9)]:min-w-[300px]  [&>tr>td:nth-child(8)]:min-w-[300px]  [&>tr>td]:break-words [&>tr>td]:whitespace-normal [&>tr>td]:overflow-hidden',

        }"
      >
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useItemsStore } from '~/stores/items'
import type { CategoryType, DateRange, CoffeeItem, Size, SizeKey } from '~/types'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
const store = useItemsStore()

// Локальное состояние для фильтров
const searchQuery = ref<string>('')
const selectedCategory = ref<CategoryType | ''>('')
const showSeasonalOnly = ref<boolean>(false)
const dateRange = ref<DateRange>({
  start: '',
  end: ''
})



const { filteredItems: rawFilteredItems, loading } = storeToRefs(store)

const formatSize = (size: Size): string => {
  if (!size) return '';
  
  const sizeEntries = Object.entries(size);
  return sizeEntries.map(([key, value]) => {
    const sizeLabel = {
      'small': 'S',
      'medium': 'M',
      'large': 'L'
    }[key as SizeKey];
    return `${sizeLabel} (${value} мл)`;
  }).join(', ');
}

const formatIngredients = (ingredients: string[]): string => {
  if (!ingredients?.length) return '';
  return ingredients.join(', ');
}

const filteredItems = computed(() => {
  if (!rawFilteredItems.value) return [];
  
  return rawFilteredItems.value.map((item: CoffeeItem) => ({
    ...item,
    size: formatSize(item.size),
    ingredients: formatIngredients(item.ingredients)
  }));
});

// Кто не делает дебаунс тот здохнет
const debouncedSearch = useDebounceFn((value: string) => {
  store.setFilters({ search: value })
}, 300)

const handleSearch = (): void => {
  debouncedSearch(searchQuery.value)
}

function handleCategoryChange(value: string | CategoryType | '') {
  selectedCategory.value = value as CategoryType | ''
  store.setFilters({ category: (value || undefined) as CategoryType | undefined })
}



const resetAllFilters = (): void => {
  searchQuery.value = ''
  selectedCategory.value = ''
  showSeasonalOnly.value = false
  dateRange.value = { start: '', end: '' }
  store.resetFilters()
}

// Загрузка данных при монтировании
onMounted(async () => {
  await store.fetchItems()
})


</script> 