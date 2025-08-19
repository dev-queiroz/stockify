/**
 * Camada de abstração do banco de dados
 * Permite trocar facilmente entre SQLite local, Supabase ou Neon.tech
 */
import { Platform } from 'react-native';
import { DatabaseConfig } from '@/types';
import { SQLiteDatabase } from './sqlite';
import { SupabaseDatabase } from './supabase';
import { NeonDatabase } from './neon';

export interface DatabaseAdapter {
  init(): Promise<void>;
  
  // Products
  createProduct(product: Omit<import('@/types').Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('@/types').Product>;
  getProducts(): Promise<import('@/types').Product[]>;
  getProduct(id: string): Promise<import('@/types').Product | null>;
  updateProduct(id: string, product: Partial<import('@/types').Product>): Promise<import('@/types').Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<import('@/types').Product[]>;
  getProductsByCategory(category: string): Promise<import('@/types').Product[]>;
  
  // Stock Movements
  createStockMovement(movement: Omit<import('@/types').StockMovement, 'id'>): Promise<import('@/types').StockMovement>;
  getStockMovements(productId?: string): Promise<import('@/types').StockMovement[]>;
  
  // Categories
  getCategories(): Promise<import('@/types').Category[]>;
  createCategory(category: Omit<import('@/types').Category, 'id'>): Promise<import('@/types').Category>;
  updateCategory(id: string, category: Partial<import('@/types').Category>): Promise<import('@/types').Category>;
  deleteCategory(id: string): Promise<void>;
}

class DatabaseManager {
  private adapter: DatabaseAdapter | null = null;
  private config: DatabaseConfig = { type: 'sqlite' };

  async init(config: DatabaseConfig = { type: 'sqlite' }) {
    this.config = config;

    switch (config.type) {
      case 'sqlite':
        if (Platform.OS === 'web') {
          throw new Error('SQLite não disponível no Web');
        }
        this.adapter = new SQLiteDatabase();
        break;
      case 'supabase':
        this.adapter = new SupabaseDatabase(config.connectionString || '');
        break;
      case 'neon':
        this.adapter = new NeonDatabase(config.connectionString || '');
        break;
      default:
        throw new Error(`Database type ${config.type} not supported`);
    }

    await this.adapter.init();
  }

  get db(): DatabaseAdapter {
    if (!this.adapter) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.adapter;
  }

  getConfig(): DatabaseConfig {
    return this.config;
  }
}

export const dbManager = new DatabaseManager();
