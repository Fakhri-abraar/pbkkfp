import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Import ini
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <--- Tambahkan ini agar .env bisa dibaca di semua tempat
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}