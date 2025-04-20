// Имитация API для работы с данными 
import items from '~/data/items.json'
import { defineEventHandler } from 'h3'
import type { CoffeeItem } from '~/types'


export default defineEventHandler(async (): Promise<CoffeeItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return items as CoffeeItem[]
}) 