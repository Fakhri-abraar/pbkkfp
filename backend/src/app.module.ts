import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Import ini
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <--- Tambahkan ini agar .env bisa dibaca di semua tempat
    AuthModule,
    PrismaModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// ... imports lainnya

@Module({
  imports: [
    // ... modules lain
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Arahkan ke folder uploads di root
      serveRoot: '/uploads', // Prefix URL (localhost:3000/uploads/...)
    }),
  ],
  // ...
})
export class AppModule {}