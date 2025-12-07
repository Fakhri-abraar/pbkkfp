import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Import PrismaModule

@Module({
  imports: [PrismaModule], // 2. Tambahkan ke sini
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}