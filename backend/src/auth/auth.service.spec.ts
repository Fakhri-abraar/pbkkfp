import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// 1. Mock Prisma (Perbaikan: Menambahkan findUnique)
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(), // <--- Wajib ada agar tidak error "undefined"
  },
};

// 2. Mock JWT Service
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

      // Mock return create
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        ...dto,
        password: 'hashed_password_example',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(dto);

      expect(result).toHaveProperty('id');
      expect(result.email).toEqual(dto.email);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token if credentials valid', async () => {
      const loginDto = { email: 'test@mail.com', password: 'password123' };
      
      // 3. Mock User Data (Lengkap sesuai schema)
      const mockUser = {
        id: '1',
        email: 'test@mail.com',
        name: 'Test User', // <--- Penting: field ini diakses di service
        password: 'hashed_password',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // 4. Mock bcrypt compare (Return TRUE)
      // Menggunakan casting 'as any' untuk menghindari masalah tipe data Promise boolean
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true) as any);

      // 5. Mock JWT sign
      mockJwtService.signAsync.mockResolvedValue('fake_jwt_token');

      const result = await service.login(loginDto);

      // Assertions
      expect(result).toHaveProperty('access_token', 'fake_jwt_token');
      expect(result.user.email).toEqual(loginDto.email);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Mock user tidak ditemukan (null)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'wrong@mail.com', password: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_password',
        name: 'Test',
        role: 'CUSTOMER',
      };
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      // Mock bcrypt return FALSE (password salah)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false) as any);

      await expect(service.login({ email: 'test@mail.com', password: 'wrong_password' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});