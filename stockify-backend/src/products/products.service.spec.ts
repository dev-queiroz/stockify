import {Test, TestingModule} from '@nestjs/testing';
import {ProductsService} from './products.service';
import {PrismaService} from '../prisma/prisma.service';
import {Product} from '@prisma/client';

// Mock PrismaClient type for product-related methods
type PrismaMock = {
    product: {
        create: jest.Mock;
        findMany: jest.Mock;
        findFirst: jest.Mock;
    };
    $connect: jest.Mock;
    $disconnect: jest.Mock;
};

describe('ProductsService', () => {
    let service: ProductsService;
    let prismaMock: PrismaMock;

    beforeEach(async () => {
        prismaMock = {
            product: {
                create: jest.fn(),
                findMany: jest.fn(),
                findFirst: jest.fn(),
            },
            $connect: jest.fn(),
            $disconnect: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {provide: PrismaService, useValue: prismaMock},
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a product', async () => {
        const data = {name: 'Test Product', price: 10, stock: 100, userId: 1, description: 'Test'};
        const product: Product = {id: 1, ...data, createdAt: new Date(), updatedAt: new Date()};
        prismaMock.product.create.mockResolvedValue(product);

        const result = await service.create(data);
        expect(result).toEqual(product);
        expect(prismaMock.product.create).toHaveBeenCalledWith({data});
    });

    it('should find all products for a user', async () => {
        const products: Product[] = [
            {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                price: 10,
                stock: 100,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ];
        prismaMock.product.findMany.mockResolvedValue(products);

        const result = await service.findAll(1);
        expect(result).toEqual(products);
        expect(prismaMock.product.findMany).toHaveBeenCalledWith({where: {userId: 1}});
    });

    it('should find one product for a user', async () => {
        const product: Product = {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            stock: 100,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        prismaMock.product.findFirst.mockResolvedValue(product);

        const result = await service.findOne(1, 1);
        expect(result).toEqual(product);
        expect(prismaMock.product.findFirst).toHaveBeenCalledWith({where: {id: 1, userId: 1}});
    });
});