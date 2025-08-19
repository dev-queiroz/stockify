import * as SQLite from 'expo-sqlite';
import { Product, StockMovement, Category } from '@/types';
import { DatabaseAdapter } from './index';

export class SQLiteDatabase implements DatabaseAdapter {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('inventory.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Tabela de produtos
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        purchase_price REAL NOT NULL DEFAULT 0,
        sale_price REAL NOT NULL DEFAULT 0,
        expiration_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
      );
    `);

    // Tabela de movimentações de estoque
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
        quantity INTEGER NOT NULL,
        reason TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      );
    `);

    // Tabela de categorias
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL
      );
    `);

    // Inserir categorias padrão
    await this.insertDefaultCategories();
  }

  private async insertDefaultCategories(): Promise<void> {
    if (!this.db) return;

    const defaultCategories = [
      { id: '1', name: 'Eletrônicos', color: '#3B82F6' },
      { id: '2', name: 'Roupas', color: '#10B981' },
      { id: '3', name: 'Casa e Jardim', color: '#F59E0B' },
      { id: '4', name: 'Esportes', color: '#EF4444' },
      { id: '5', name: 'Livros', color: '#8B5CF6' },
    ];

    for (const category of defaultCategories) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO categories (id, name, color) VALUES (?, ?, ?)',
        [category.id, category.name, category.color]
      );
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO products 
       (id, name, category_id, quantity, purchase_price, sale_price, expiration_date, notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, product.name, product.categoryId, product.quantity, product.purchasePrice, 
       product.salePrice, product.expirationDate || null, product.notes || null, now, now]
    );

    return {
      id,
      ...product,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getProducts(): Promise<Product[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(`
      SELECT * FROM products ORDER BY created_at DESC
    `);

    return result.map(this.mapRowToProduct);
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    return result ? this.mapRowToProduct(result) : null;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    if (!this.db) throw new Error('Database not initialized');

    const updates: string[] = [];
    const values: any[] = [];
    const now = new Date().toISOString();

    if (product.name !== undefined) {
      updates.push('name = ?');
      values.push(product.name);
    }
    if (product.categoryId !== undefined) {
      updates.push('category_id = ?');
      values.push(product.categoryId);
    }
    if (product.quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(product.quantity);
    }
    if (product.purchasePrice !== undefined) {
      updates.push('purchase_price = ?');
      values.push(product.purchasePrice);
    }
    if (product.salePrice !== undefined) {
      updates.push('sale_price = ?');
      values.push(product.salePrice);
    }
    if (product.expirationDate !== undefined) {
      updates.push('expiration_date = ?');
      values.push(product.expirationDate);
    }
    if (product.notes !== undefined) {
      updates.push('notes = ?');
      values.push(product.notes);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await this.db.runAsync(query, values);

    const updated = await this.getProduct(id);
    if (!updated) {
      throw new Error('Product not found after update');
    }

    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM products WHERE id = ?', [id]);
  }

  async createStockMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      'INSERT INTO stock_movements (id, product_id, type, quantity, reason, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, movement.productId, movement.type, movement.quantity, movement.reason, movement.date, movement.notes || null]
    );

    return { id, ...movement };
  }

  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM stock_movements';
    let params: any[] = [];

    if (productId) {
      query += ' WHERE product_id = ?';
      params.push(productId);
    }

    query += ' ORDER BY date DESC';

    const result = await this.db.getAllAsync(query, params);
    return result.map(this.mapRowToStockMovement);
  }

  async getCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM categories ORDER BY name');
    return result.map(this.mapRowToCategory);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      'INSERT INTO categories (id, name, color) VALUES (?, ?, ?)',
      [id, category.name, category.color]
    );

    return { id, ...category };
  }

  async updateCategory(id: string, category: Partial<import('@/types').Category>): Promise<import('@/types').Category> {
    if (!this.db) throw new Error('Database not initialized');
    
    const updates: string[] = [];
    const values: any[] = [];
    
    if (category.name !== undefined) {
      updates.push('name = ?');
      values.push(category.name);
    }
    
    if (category.color !== undefined) {
      updates.push('color = ?');
      values.push(category.color);
    }
    
    if (updates.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    
    await this.db.runAsync(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    const updated = await this.db.getFirstAsync<import('@/types').Category>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (!updated) {
      throw new Error('Category not found after update');
    }
    
    return updated;
  }
  
  async deleteCategory(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    // First, update all products that reference this category to set category to null
    await this.db.runAsync(
      'UPDATE products SET category_id = NULL WHERE category_id = ?',
      [id]
    );
    
    // Then delete the category
    await this.db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync<{
      id: string;
      name: string;
      category_id: string;
      quantity: number;
      purchase_price: number;
      sale_price: number;
      expiration_date: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM products WHERE name LIKE ? ORDER BY name', [`%${query}%`]);

    return result.map(row => this.mapRowToProduct(row));
  }
  
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync<{
      id: string;
      name: string;
      category_id: string;
      quantity: number;
      purchase_price: number;
      sale_price: number;
      expiration_date: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM products WHERE category_id = ? ORDER BY name', [categoryId]);

    return result.map(row => this.mapRowToProduct(row));
  }

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      categoryId: row.category_id,
      quantity: row.quantity,
      purchasePrice: row.purchase_price,
      salePrice: row.sale_price,
      expirationDate: row.expiration_date || undefined,
      notes: row.notes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToStockMovement(row: any): StockMovement {
    return {
      id: row.id,
      productId: row.product_id,
      type: row.type,
      quantity: row.quantity,
      reason: row.reason,
      date: row.date,
      notes: row.notes,
    };
  }

  private mapRowToCategory(row: any): Category {
    return {
      id: row.id,
      name: row.name,
      color: row.color,
    };
  }
}