import {Module} from '@nestjs/common';
import {MetricsController} from './metrics.controller';
import {MetricsService} from './metrics.service';
import {PrismaService} from '../prisma/prisma.service';

@Module({
    controllers: [MetricsController],
    providers: [MetricsService, PrismaService],
})
export class MetricsModule {
}