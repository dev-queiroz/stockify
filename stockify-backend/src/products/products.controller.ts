import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ProductsService} from './products.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {GetUser} from '../auth/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {
    }

    @Post()
    create(
        @Body() body: { name: string; description?: string; price: number; stock: number },
        @GetUser() user,
    ) {
        return this.productsService.create({...body, userId: user.userId});
    }

    @Get()
    findAll(@GetUser() user) {
        return this.productsService.findAll(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser() user) {
        return this.productsService.findOne(+id, user.userId);
    }
}