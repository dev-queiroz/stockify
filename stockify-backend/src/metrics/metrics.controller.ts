import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {MetricsService} from './metrics.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {GetUser} from '../auth/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
    constructor(private metricsService: MetricsService) {
    }

    @Post()
    create(@Body() body: { productId?: number; stockLevel: number }, @GetUser() user) {
        return this.metricsService.create({...body, userId: user.userId});
    }

    @Get()
    findAll(@GetUser() user) {
        return this.metricsService.findAll(user.userId);
    }
}