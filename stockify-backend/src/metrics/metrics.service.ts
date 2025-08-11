import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
    constructor(private prisma: PrismaService) {
    }

    create(data: { productId?: number; stockLevel: number; userId: number }) {
        return this.prisma.metrics.create({data});
    }

    findAll(userId: number) {
        return this.prisma.metrics.findMany({where: {userId}});
    }
}