import {Module} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import {AuthModule} from './auth/auth.module';
import {ProductsModule} from './products/products.module';
import {InventoryModule} from './inventory/inventory.module';
import {MetricsModule} from './metrics/metrics.module';

@Module({
    imports: [
        AuthModule,
        ProductsModule,
        InventoryModule,
        MetricsModule,
    ],
    providers: [PrismaService],
})
export class AppModule {
}