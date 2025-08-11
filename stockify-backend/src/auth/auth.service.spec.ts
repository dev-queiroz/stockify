import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {PrismaService} from '../prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {User} from '@prisma/client';

type PrismaMock = {
    user: {
        create: jest.Mock;
        findUnique: jest.Mock;
    };
    $connect: jest.Mock;
    $disconnect: jest.Mock;
};

describe('AuthService', () => {
    let service: AuthService;
    let prismaMock: PrismaMock;
    let jwtServiceMock: Partial<JwtService>;

    beforeEach(async () => {
        prismaMock = {
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
            },
            $connect: jest.fn(),
            $disconnect: jest.fn(),
        };

        jwtServiceMock = {
            sign: jest.fn().mockReturnValue('mocked_token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {provide: PrismaService, useValue: prismaMock},
                {provide: JwtService, useValue: jwtServiceMock},
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should register a user', async () => {
        const body = {email: 'test@example.com', password: 'pass123', name: 'Test'};
        const hashed = await bcrypt.hash(body.password, 10);
        const user: User = {
            id: 1,
            email: body.email,
            password: hashed,
            name: body.name,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        prismaMock.user.create.mockResolvedValue(user);

        const result = await service.register(body);
        expect(result).toEqual({message: 'User created', userId: 1});
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: {email: body.email, password: expect.any(String), name: body.name},
        });
    });

    it('should validate a user', async () => {
        const user: User = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('pass123', 10),
            name: 'Test',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        prismaMock.user.findUnique.mockResolvedValue(user);

        const result = await service.validateUser('test@example.com', 'pass123');
        expect(result).toEqual({
            id: 1,
            email: 'test@example.com',
            name: 'Test',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where: {email: 'test@example.com'}});
    });

    it('should return null for invalid credentials', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const result = await service.validateUser('test@example.com', 'wrongpass');
        expect(result).toBeNull();
    });
});