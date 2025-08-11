import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string; name: string }) {
        return this.authService.register(body);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body);
    }
}