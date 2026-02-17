
import { createContext, useContext, useState, useEffect } from 'react';
import { AppState, ThemeType, Product, User } from './types';
import { INITIAL_EXCHANGE_RATE } from './constants';
import { trackEvent } from './services/analytics';
import { BackendAPI } from './services/backend';

interface AppContextProps extends AppState {
  setExchangeRate: (rate: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setTheme: (theme: ThemeType) => void;
  setIsAdmin: (val: boolean) => void;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  refreshData: () => Promise<void>;
  login: (name: string, phone: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRate, setExchangeRateState] = useState(INITIAL_EXCHANGE_RATE);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [theme, setTheme] = useState<ThemeType>(ThemeType.GOLD_BLACK);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize App Data from "Backend"
  useEffect(() => {
    const initApp = async () => {
      try {
        // Load Local State
        const savedRate = localStorage.getItem('mamo_exchange_rate');
        if (savedRate) setExchangeRateState(JSON.parse(savedRate));

        const savedUser = localStorage.getItem('mamo_current_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('mamo_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        // Fetch Products from Backend
        const fetchedProducts = await BackendAPI.getProducts();
        
        // Apply exchange rate
        const pricedProducts = fetchedProducts.map(p => ({
          ...p,
          priceSYP: Math.ceil((p.priceUSD * (savedRate ? JSON.parse(savedRate) : INITIAL_EXCHANGE_RATE)) / 100) * 100
        }));
        
        setProducts(pricedProducts);
      } catch (e) {
        console.error("Initialization Failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('mamo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mamo_exchange_rate', JSON.stringify(exchangeRate));
  }, [exchangeRate]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mamo_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mamo_current_user');
    }
  }, [currentUser]);

  const setExchangeRate = (rate: number) => {
    setExchangeRateState(rate);
    setProducts(prev => prev.map(p => ({
      ...p,
      priceSYP: Math.ceil((p.priceUSD * rate) / 100) * 100 
    })));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const deleteProduct = async (id: string) => {
    // Optimistic Update
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
       await BackendAPI.deleteProduct(id);
    } catch (e) {
       console.error("Failed to delete product from server", e);
       // Revert or show error could happen here
    }
  };
  
  const addProduct = async (product: Product) => {
    const newProduct = {
      ...product,
      priceSYP: Math.ceil((product.priceUSD * exchangeRate) / 100) * 100
    };
    
    // Optimistic Update
    setProducts(prev => [newProduct, ...prev]);

    try {
       await BackendAPI.addProduct(newProduct);
    } catch (e) {
       console.error("Failed to add product to server", e);
    }
  };

  const updateProduct = async (product: Product) => {
    const updatedProduct = {
      ...product,
      priceSYP: Math.ceil((product.priceUSD * exchangeRate) / 100) * 100
    };
    
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));

    try {
       await BackendAPI.updateProduct(updatedProduct);
    } catch (e) {
       console.error("Failed to update product on server", e);
    }
  };

  const login = async (name: string, phone: string) => {
    setIsLoading(true);
    try {
      const response = await BackendAPI.login(name, phone);
      setCurrentUser(response.user);
      trackEvent('user_login', { user_id: response.user.id });
    } catch (e) {
      alert("فشل تسجيل الدخول. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    trackEvent('user_logout', { user_id: currentUser?.id });
    setCurrentUser(null);
    setIsAdmin(false);
    clearCart();
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await BackendAPI.getProducts();
      const pricedProducts = fetchedProducts.map(p => ({
        ...p,
        priceSYP: Math.ceil((p.priceUSD * exchangeRate) / 100) * 100
      }));
      setProducts(pricedProducts);
      
      // Simulate slight exchange rate fluctuation
      if (Math.random() > 0.8) {
         const fluctuation = Math.floor(Math.random() * 50) - 25;
         setExchangeRate(exchangeRate + fluctuation);
      }
    } catch(e) {
      console.error("Refresh failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      products, exchangeRate, cart, theme, isAdmin, currentUser, isLoading,
      setExchangeRate, addToCart, removeFromCart, clearCart, 
      setTheme, setIsAdmin, deleteProduct, addProduct, updateProduct,
      refreshData, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
