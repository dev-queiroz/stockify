import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'X7j9kPq2mW8vL3nR5tY6uZ1xQ4cB2aF9gH8jK',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}