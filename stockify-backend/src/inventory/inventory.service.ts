import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) {
    }

    async create(data: { productId: number; quantity: number; type: string; userId: number }) {
        const product = await this.prisma.product.findFirst({
            where: {id: data.productId, userId: data.userId},
        });
        if (!product) throw new Error('Product not found or not owned by user');

        const inventory = await this.prisma.inventory.create({data});
        const stockChange = data.type === 'in' ? data.quantity : -data.quantity;
        await this.prisma.product.update({
            where: {id: data.productId},
            data: {stock: {increment: stockChange}},
        });
        return inventory;
    }

    findAll(userId: number) {
        return this.prisma.inventory.findMany({where: {userId}});
    }
}