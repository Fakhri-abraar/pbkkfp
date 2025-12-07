// backend/src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER',
}

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}