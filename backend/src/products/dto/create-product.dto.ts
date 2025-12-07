import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Number) // Ubah string ke number otomatis
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  stock: number;
}