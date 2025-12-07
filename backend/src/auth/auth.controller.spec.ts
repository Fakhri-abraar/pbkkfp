// backend/src/auth/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // 1. Buat Mock untuk AuthService
  const mockAuthService = {
    register: jest.fn().mockResolvedValue({
      id: 'uuid-test',
      email: 'test@mail.com',
      name: 'Test User',
      role: 'CUSTOMER',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      // 2. Masukkan Provider (Service) di sini
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Gunakan versi mock, bukan yang asli
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tambahan Test Case untuk memastikan endpoint register berjalan
  it('should register a user', async () => {
    const dto = {
      name: 'Test',
      email: 'test@mail.com',
      password: 'password',
      role: 'CUSTOMER' as any,
    };

    const result = await controller.register(dto);

    expect(result).toEqual({
      id: 'uuid-test',
      email: 'test@mail.com',
      name: 'Test User',
      role: 'CUSTOMER',
    });
    
    // Pastikan service.register benar-benar dipanggil dengan parameter yang tepat
    expect(service.register).toHaveBeenCalledWith(dto);
  });
});