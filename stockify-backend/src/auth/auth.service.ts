import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
    }

    async register({email, password, name}) {
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({data: {email, password: hashed, name}});
        return {message: 'User created', userId: user.id};
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({where: {email}});
        if (user && (bcrypt.compare(pass, user.password))) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {email: user.email, sub: user.id};
        return {access_token: this.jwtService.sign(payload)};
    }
}