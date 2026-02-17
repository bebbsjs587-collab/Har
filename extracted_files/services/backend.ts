
import { Product, User } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const STORAGE_KEYS = {
  PRODUCTS: 'mamo_db_products',
  USER: 'mamo_current_user',
  RATE: 'mamo_exchange_rate',
  CUSTOM_SERVER: 'mamo_custom_server_url'
};

export class BackendAPI {
  // نستخدم مساراً نسبياً ليعمل التوجيه (Redirect) في Netlify بشكل تلقائي
  // Fix: Use custom server URL from localStorage if available, otherwise default to '/api'
  public static get API_URL() {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_SERVER);
    return custom || '/api';
  }

  public static async getProducts(): Promise<Product[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
      return MOCK_PRODUCTS;
    } catch (e) {
      return MOCK_PRODUCTS;
    }
  }

  public static async addProduct(product: Product) {
    const products = await this.getProducts();
    const updated = [product, ...products];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return { success: true };
  }

  public static async updateProduct(product: Product) {
    const products = await this.getProducts();
    const updated = products.map(p => p.id === product.id ? product : p);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return { success: true };
  }

  public static async deleteProduct(id: string) {
    const products = await this.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return { success: true };
  }

  public static async login(name: string, phone: string) {
    const user = { id: phone, name, phone, joinDate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { user };
  }

  // Fix: Added missing setServerUrl method to allow users to configure custom backend endpoints in Profile.tsx
  public static setServerUrl(url: string) {
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SERVER, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_SERVER);
    }
    // Refresh the application to apply the new server configuration globally
    window.location.reload();
  }

  public static getServerUrl() {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_SERVER);
    if (custom) return custom;
    // يعيد الرابط الكامل للـ API للتأكد من الصحة
    return window.location.origin + '/api';
  }
}
