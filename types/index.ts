export interface Credentials {
  username: string
  passphrase: string
}

export interface User {
  name: string
  surname: string
  credentials: Credentials
  active: boolean
  created: string
  _comment: string
}
export type CategoryType = 'hot' | 'cold' | 'seasonal';
export type StatusType = 'available' | 'unavailable';
export type SizeKey = 'small' | 'medium' | 'large';

export interface Size {
    small?: number;
    medium?: number;
    large?: number;
}

export interface DateRange {
    start: string;
    end: string;
}

export interface CoffeeItem {
    id: number;
    status: StatusType;
    date_created: string;
    name: string;
    price: number;
    description: string;
    category: CategoryType;
    ingredients: string[];
    size: Size;
    isSeasonalOffer: boolean;
    calories: number;
}

export interface CoffeeFilters {
    search?: string;
    category?: CategoryType;
    dateRange?: DateRange;
    isSeasonalOffer?: boolean;
} 