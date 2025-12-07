// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import Module Prisma

@Module({
  imports: [PrismaModule], // <--- MASUKKAN KE SINI
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}