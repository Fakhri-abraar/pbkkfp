// backend/src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan path import benar
import * as bcrypt from 'bcrypt';

// 1. Mock Prisma Service (Agar tidak nulis ke DB asli saat test)
const mockPrismaService = {
  user: {
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
});