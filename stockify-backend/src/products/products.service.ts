import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {
    }

    create(data: { name: string; description?: string; price: number; stock: number; userId: number }) {
        return this.prisma.product.create({data});
    }

    findAll(userId: number) {
        return this.prisma.product.findMany({where: {userId}});
    }

    findOne(id: number, userId: number) {
        return this.prisma.product.findFirst({where: {id, userId}});
    }
}