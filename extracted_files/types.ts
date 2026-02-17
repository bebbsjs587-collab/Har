
export enum Category {
  ELECTRICITY = 'كهرباء',
  CONSTRUCTION = 'بناء',
  WATER = 'مياه',
  PAINT = 'دهانات'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  priceSYP: number;
  priceUSD: number;
  image: string;
  description: string;
  brand: string;
  rating: number;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
}

export enum ThemeType {
  GOLD_BLACK = 'GOLD_BLACK',
  RED_BLACK = 'RED_BLACK',
  GREEN_RED = 'GREEN_RED'
}

export interface AppState {
  products: Product[];
  exchangeRate: number;
  cart: { product: Product; quantity: number }[];
  theme: ThemeType;
  isAdmin: boolean;
  currentUser: User | null;
}
