import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Aktifkan CORS (Wajib agar Frontend di port 5173 bisa akses Backend di port 3000)
  app.enableCors();

  // 3. Aktifkan Global Pipes untuk validasi & transformasi data otomatis
  // (Mengubah string "15000" menjadi number 15000 sesuai DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Fitur ini yang mengubah tipe data otomatis
      whitelist: true, // Menghapus property yang tidak ada di DTO (keamanan)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();