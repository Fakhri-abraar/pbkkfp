import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, UseInterceptors, UploadedFile, Req, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Kita buat Guard ini sebentar lagi
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 1. Proteksi Endpoint
  @UseInterceptors(FileInterceptor('file', { // 2. Handle File Upload
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `product-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(
    @Req() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }), // Max 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }), // Hanya gambar
        ],
        fileIsRequired: true, // Wajib ada file
      }),
    ) file: Express.Multer.File,
  ) {
    const userId = req.user.id; // Ambil ID dari JWT
    return this.productsService.create(userId, createProductDto, file.path);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}