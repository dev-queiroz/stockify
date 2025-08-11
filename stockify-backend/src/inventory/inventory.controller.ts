import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {InventoryService} from './inventory.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {GetUser} from '../auth/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) {
    }

    @Post()
    create(@Body() body: { productId: number; quantity: number; type: string }, @GetUser() user) {
        return this.inventoryService.create({...body, userId: user.userId});
    }

    @Get()
    findAll(@GetUser() user) {
        return this.inventoryService.findAll(user.userId);
    }
}