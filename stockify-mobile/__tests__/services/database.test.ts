/**
 * Testes unitários para o sistema de banco de dados
 * Execute com: npm test
 */
import { dbManager } from '../../services/db';
import { Product, StockMovement } from '../../types';

describe('Database Service', () => {
  beforeAll(async () => {
    await dbManager.init();
  });

  describe('Products', () => {
    const sampleProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Produto Teste',
      category: 'Teste',
      quantity: 10,
      purchasePrice: 50.00,
      salePrice: 100.00,
      expirationDate: '2024-12-31',
      notes: 'Produto para teste unitário',
    };

    let createdProductId: string;

    test('should create a product', async () => {
      const product = await dbManager.db.createProduct(sampleProduct);
      
      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(sampleProduct.name);
      expect(product.category).toBe(sampleProduct.category);
      expect(product.quantity).toBe(sampleProduct.quantity);
      expect(product.purchasePrice).toBe(sampleProduct.purchasePrice);
      expect(product.salePrice).toBe(sampleProduct.salePrice);
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
      
      createdProductId = product.id;
    });

    test('should get all products', async () => {
      const products = await dbManager.db.getProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    test('should get a specific product', async () => {
      const product = await dbManager.db.getProduct(createdProductId);
      
      expect(product).toBeDefined();
      expect(product?.id).toBe(createdProductId);
      expect(product?.name).toBe(sampleProduct.name);
    });

    test('should update a product', async () => {
      const updatedData = {
        name: 'Produto Teste Atualizado',
        quantity: 20,
      };
      
      const updatedProduct = await dbManager.db.updateProduct(createdProductId, updatedData);
      
      expect(updatedProduct.name).toBe(updatedData.name);
      expect(updatedProduct.quantity).toBe(updatedData.quantity);
      expect(updatedProduct.category).toBe(sampleProduct.category); // Não deve ter mudado
    });

    test('should search products by name', async () => {
      const results = await dbManager.db.searchProducts('Teste');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.id === createdProductId)).toBe(true);
    });

    test('should get products by category', async () => {
      const results = await dbManager.db.getProductsByCategory('Teste');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.category === 'Teste')).toBe(true);
    });

    test('should delete a product', async () => {
      await dbManager.db.deleteProduct(createdProductId);
      
      const deletedProduct = await dbManager.db.getProduct(createdProductId);
      expect(deletedProduct).toBeNull();
    });
  });

  describe('Stock Movements', () => {
    let testProductId: string;

    beforeAll(async () => {
      // Criar produto para testes de movimentação
      const product = await dbManager.db.createProduct({
        name: 'Produto para Movimentação',
        category: 'Teste',
        quantity: 50,
        purchasePrice: 25.00,
        salePrice: 50.00,
      });
      testProductId = product.id;
    });

    test('should create stock movement', async () => {
      const movementData: Omit<StockMovement, 'id'> = {
        productId: testProductId,
        type: 'IN',
        quantity: 10,
        reason: 'Entrada de teste',
        date: new Date().toISOString(),
        notes: 'Movimento para teste unitário',
      };

      const movement = await dbManager.db.createStockMovement(movementData);
      
      expect(movement).toBeDefined();
      expect(movement.id).toBeDefined();
      expect(movement.productId).toBe(movementData.productId);
      expect(movement.type).toBe(movementData.type);
      expect(movement.quantity).toBe(movementData.quantity);
      expect(movement.reason).toBe(movementData.reason);
    });

    test('should get all stock movements', async () => {
      const movements = await dbManager.db.getStockMovements();
      
      expect(Array.isArray(movements)).toBe(true);
      expect(movements.length).toBeGreaterThan(0);
    });

    test('should get stock movements by product', async () => {
      const movements = await dbManager.db.getStockMovements(testProductId);
      
      expect(Array.isArray(movements)).toBe(true);
      expect(movements.every(m => m.productId === testProductId)).toBe(true);
    });

    afterAll(async () => {
      // Limpar produto de teste
      await dbManager.db.deleteProduct(testProductId);
    });
  });

  describe('Categories', () => {
    test('should get categories', async () => {
      const categories = await dbManager.db.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Verificar se as categorias padrão existem
      const categoryNames = categories.map(c => c.name);
      expect(categoryNames).toContain('Eletrônicos');
      expect(categoryNames).toContain('Roupas');
    });

    test('should create custom category', async () => {
      const categoryData = {
        name: 'Categoria Teste',
        color: '#FF5733',
      };

      const category = await dbManager.db.createCategory(categoryData);
      
      expect(category).toBeDefined();
      expect(category.id).toBeDefined();
      expect(category.name).toBe(categoryData.name);
      expect(category.color).toBe(categoryData.color);
    });
  });
});