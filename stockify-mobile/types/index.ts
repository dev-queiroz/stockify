export interface Product {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface DatabaseConfig {
  type: 'sqlite' | 'supabase' | 'neon';
  connectionString?: string;
}

export interface AppTheme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}