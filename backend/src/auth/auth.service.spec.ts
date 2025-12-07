// backend/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// 1. MOCK MODULE BCRYPT SECARA GLOBAL
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(), // Kita akan atur return value-nya nanti per test case
}));

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks(); // Bersihkan mock sebelum tiap test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      const dto = {
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'password123',
        role: 'SELLER' as any,
      };

      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        ...dto,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(dto);

      expect(result).toHaveProperty('id');
      expect(result.email).toEqual(dto.email);
      expect(bcrypt.hash).toHaveBeenCalled(); // Pastikan fungsi hash dipanggil
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@mail.com', password: 'password123' };
    const mockUser = {
      id: '1',
      email: 'test@mail.com',
      name: 'Test User',
      password: 'hashed_password',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return access token if credentials valid', async () => {
      // Setup Mock
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password COCOK
      mockJwtService.signAsync.mockResolvedValue('fake_jwt_token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'fake_jwt_token');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'wrong@mail.com', password: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password SALAH

      await expect(service.login({ email: 'test@mail.com', password: 'wrong_password' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});