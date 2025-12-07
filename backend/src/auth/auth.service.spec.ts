// backend/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'; // <--- Import JwtService
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// 1. Mock Prisma Service (Agar tidak nulis ke DB asli saat test)
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(), // <--- Tambahkan findUnique
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
        { provide: JwtService, useValue: mockJwtService }, // <--- Inject Mock JWT
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  // TEST CASE UTAMA
  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      // ARRANGE (Persiapan Data)
      const dto = {
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'password123',
        role: 'SELLER' as any,
      };

      // Kita pura-pura DB berhasil membuat user
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        ...dto,
        password: 'hashed_password_example', // Simulasi hasil hash
        createdAt: new Date(),
      });

      // ACT (Jalankan fungsi)
      const result = await service.register(dto);

      // ASSERT (Cek hasil)
      expect(result).toHaveProperty('id');
      expect(result.email).toEqual(dto.email);
      // Pastikan prisma.user.create terpanggil
      expect(prisma.user.create).toHaveBeenCalled();
      
      // Verifikasi argumen yang dikirim ke DB (Password harus beda dgn input asli karena di-hash)
      const createCallArgs = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCallArgs.data.password).not.toEqual(dto.password);
    });
  });
  describe('login', () => {
    it('should return access token if credentials valid', async () => {
      const loginDto = { email: 'test@mail.com', password: 'password123' };
      
      // 1. Mock user ditemukan di DB
      const mockUser = {
        id: '1',
        email: 'test@mail.com',
        password: 'hashed_password',
        role: 'CUSTOMER',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // 2. Mock bcrypt compare (pura-pura password cocok)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      // 3. Mock JWT sign
      mockJwtService.signAsync.mockResolvedValue('fake_jwt_token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'fake_jwt_token');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
    });

    it('should throw error if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'wrong@mail.com', password: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});