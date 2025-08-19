import { Product, StockMovement, Category } from '@/types';
import { DatabaseAdapter } from './index';

/**
 * Implementação futura para Neon.tech (PostgreSQL)
 * Para usar: npm install @neondatabase/serverless
 */
export class NeonDatabase implements DatabaseAdapter {
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async init(): Promise<void> {
    // TODO: Implementar inicialização do Neon
    throw new Error('Neon implementation not yet available');
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async getProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  async getProduct(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async deleteProduct(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async searchProducts(query: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  async createStockMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
    throw new Error('Method not implemented.');
  }

  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    throw new Error('Method not implemented.');
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    throw new Error('Method not implemented.');
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  async deleteCategory(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}