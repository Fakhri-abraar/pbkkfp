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
      name: dto.name,
      description: dto.description,
      // Pastikan konversi ke number atau string agar Prisma bisa menjadikannya Decimal
      price: Number(dto.price), 
      stock: Number(dto.stock),
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