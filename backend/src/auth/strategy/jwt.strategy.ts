// backend/src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Ambil token dari Header Authorization: Bearer <token>
      secretOrKey: config.get('JWT_SECRET'), // Cek tanda tangan token pakai Secret Key
    });
  }

  async validate(payload: any) {
    // Fungsi ini terpanggil jika token valid.
    // Kita bisa ambil data user dari database berdasarkan payload.sub (userId)
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    
    // Hapus password agar tidak bocor ke request
    if (user) delete user.password;
    return user; 
    // Return value ini akan ditempel ke `request.user` di Controller
  }
}