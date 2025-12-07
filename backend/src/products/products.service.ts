import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProductDto, imagePath: string | null) {
    if (!imagePath) {
      throw new BadRequestException('Gambar produk wajib diupload!');
    }

    return this.prisma.product.create({
      data: {
        ...dto,
        price: Number(dto.price), // Pastikan jadi number
        stock: Number(dto.stock), // Pastikan jadi number
        imageUrl: imagePath,
        userId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { user: { select: { name: true } } } // Tampilkan nama seller
    });
  }

  // ... (Implementasi findOne, update, remove nanti) ...
}