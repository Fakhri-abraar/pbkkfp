// backend/src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product with image', async () => {
      const userId = 'user-123';
      const createProductDto = {
        name: 'Laptop Gaming',
        description: 'Super kencang',
        price: 15000000,
        stock: 10,
      };
      const imagePath = 'uploads/laptop.jpg';

      mockPrismaService.product.create.mockResolvedValue({
        id: 'prod-1',
        ...createProductDto,
        imageUrl: imagePath,
        userId,
      });

      const result = await service.create(userId, createProductDto, imagePath);

      expect(result).toHaveProperty('id', 'prod-1');
      expect(result.imageUrl).toBe(imagePath);
      expect(prisma.product.create).toHaveBeenCalled();
    });

    it('should throw error if image is missing', async () => {
      const userId = 'user-123';
      const createProductDto = {
        name: 'Laptop',
        description: 'Desc',
        price: 5000000,
        stock: 5,
      };

      // Panggil create tanpa imagePath (null)
      await expect(service.create(userId, createProductDto, null))
        .rejects.toThrow(BadRequestException);
    });
  });
});