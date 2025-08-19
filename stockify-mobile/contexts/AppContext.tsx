import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, StockMovement, Category, AppTheme } from '@/types';
import { dbManager } from '@/services/db';

interface AppState {
  products: Product[];
  stockMovements: StockMovement[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  theme: AppTheme;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_STOCK_MOVEMENTS'; payload: StockMovement[] }
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'TOGGLE_THEME' };

const lightTheme: AppTheme = {
  isDark: false,
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

const darkTheme: AppTheme = {
  isDark: true,
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

const initialState: AppState = {
  products: [],
  stockMovements: [],
  categories: [],
  loading: false,
  error: null,
  theme: lightTheme,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'SET_STOCK_MOVEMENTS':
      return { ...state, stockMovements: action.payload };
    case 'ADD_STOCK_MOVEMENT':
      return { ...state, stockMovements: [action.payload, ...state.stockMovements] };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme.isDark ? lightTheme : darkTheme };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  // Products
  loadProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  
  // Stock Movements
  loadStockMovements: (productId?: string) => Promise<void>;
  createStockMovement: (movement: Omit<StockMovement, 'id'>) => Promise<void>;
  
  // Categories
  loadCategories: () => Promise<void>;
  
  // Theme
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Products
  const loadProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await dbManager.db.getProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProduct = await dbManager.db.createProduct(product);
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProduct = await dbManager.db.updateProduct(id, product);
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await dbManager.db.deleteProduct(id);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      return await dbManager.db.searchProducts(query);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      return [];
    }
  };

  // Stock Movements
  const loadStockMovements = async (productId?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const movements = await dbManager.db.getStockMovements(productId);
      dispatch({ type: 'SET_STOCK_MOVEMENTS', payload: movements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createStockMovement = async (movement: Omit<StockMovement, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Atualizar a quantidade do produto
      const product = await dbManager.db.getProduct(movement.productId);
      if (product) {
        const newQuantity = movement.type === 'IN' 
          ? product.quantity + movement.quantity
          : product.quantity - movement.quantity;
        
        await dbManager.db.updateProduct(movement.productId, { quantity: newQuantity });
        
        const updatedProduct = await dbManager.db.getProduct(movement.productId);
        if (updatedProduct) {
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
        }
      }
      
      const newMovement = await dbManager.db.createStockMovement(movement);
      dispatch({ type: 'ADD_STOCK_MOVEMENT', payload: newMovement });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Categories
  const loadCategories = async () => {
    try {
      const categories = await dbManager.db.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Theme
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  // Inicializar dados ao montar o contexto
  useEffect(() => {
    const initializeData = async () => {
      await loadProducts();
      await loadCategories();
      await loadStockMovements();
    };

    initializeData();
  }, []);

  const value: AppContextType = {
    ...state,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    loadStockMovements,
    createStockMovement,
    loadCategories,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}