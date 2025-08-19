/**
 * Script para popular o banco de dados com dados de exemplo
 * Execute: npx ts-node scripts/seed-database.ts
 */
import { dbManager } from '../services/db';
import { Product } from '../types';

const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'iPhone 15 Pro',
    category: 'Eletrônicos',
    quantity: 15,
    purchasePrice: 4500.00,
    salePrice: 5999.00,
    expirationDate: undefined,
    notes: 'Smartphone Apple com 256GB de armazenamento',
  },
  {
    name: 'Samsung Galaxy S24',
    category: 'Eletrônicos',
    quantity: 8,
    purchasePrice: 3800.00,
    salePrice: 4999.00,
    expirationDate: undefined,
    notes: 'Smartphone Samsung com 128GB',
  },
  {
    name: 'Camiseta Nike',
    category: 'Roupas',
    quantity: 50,
    purchasePrice: 45.00,
    salePrice: 89.99,
    expirationDate: undefined,
    notes: 'Camiseta esportiva tamanho M',
  },
  {
    name: 'Tênis Adidas',
    category: 'Esportes',
    quantity: 25,
    purchasePrice: 180.00,
    salePrice: 299.99,
    expirationDate: undefined,
    notes: 'Tênis de corrida tamanho 42',
  },
  {
    name: 'Notebook Dell',
    category: 'Eletrônicos',
    quantity: 5,
    purchasePrice: 2800.00,
    salePrice: 3999.00,
    expirationDate: undefined,
    notes: 'Notebook com Intel i7 e 16GB RAM',
  },
  {
    name: 'Mesa de Escritório',
    category: 'Casa e Jardim',
    quantity: 12,
    purchasePrice: 350.00,
    salePrice: 599.00,
    expirationDate: undefined,
    notes: 'Mesa de madeira com 4 gavetas',
  },
  {
    name: 'Livro - Clean Code',
    category: 'Livros',
    quantity: 30,
    purchasePrice: 45.00,
    salePrice: 79.90,
    expirationDate: undefined,
    notes: 'Livro sobre boas práticas de programação',
  },
  {
    name: 'Fone Bluetooth Sony',
    category: 'Eletrônicos',
    quantity: 20,
    purchasePrice: 250.00,
    salePrice: 399.00,
    expirationDate: undefined,
    notes: 'Fone sem fio com cancelamento de ruído',
  },
  {
    name: 'Bicicleta Mountain Bike',
    category: 'Esportes',
    quantity: 3,
    purchasePrice: 1200.00,
    salePrice: 1899.00,
    expirationDate: undefined,
    notes: 'Bicicleta aro 29 com 21 marchas',
  },
  {
    name: 'Produto com Validade',
    category: 'Casa e Jardim',
    quantity: 5,
    purchasePrice: 25.00,
    salePrice: 45.00,
    expirationDate: '2024-12-31',
    notes: 'Produto exemplo com data de validade próxima',
  },
];

async function seedDatabase() {
  console.log('🌱 Iniciando população do banco de dados...');
  
  try {
    // Inicializar o banco de dados
    await dbManager.init();
    console.log('✅ Banco de dados inicializado');

    // Inserir produtos de exemplo
    for (const productData of sampleProducts) {
      try {
        const product = await dbManager.db.createProduct(productData);
        console.log(`✅ Produto criado: ${product.name}`);
        
        // Criar algumas movimentações de exemplo
        if (Math.random() > 0.5) {
          await dbManager.db.createStockMovement({
            productId: product.id,
            type: 'IN',
            quantity: Math.floor(Math.random() * 10) + 1,
            reason: 'Entrada inicial',
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        
        if (Math.random() > 0.7) {
          await dbManager.db.createStockMovement({
            productId: product.id,
            type: 'OUT',
            quantity: Math.floor(Math.random() * 3) + 1,
            reason: 'Venda',
            date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      } catch (error) {
        console.log(`❌ Erro ao criar produto ${productData.name}:`, error);
      }
    }

    console.log('🎉 População do banco de dados concluída com sucesso!');
    console.log('📊 Estatísticas:');
    
    const products = await dbManager.db.getProducts();
    const movements = await dbManager.db.getStockMovements();
    
    console.log(`   - ${products.length} produtos criados`);
    console.log(`   - ${movements.length} movimentações criadas`);
    
  } catch (error) {
    console.error('❌ Erro ao popular o banco de dados:', error);
    process.exit(1);
  }
}

// Executar script se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };