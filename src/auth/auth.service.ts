// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2'
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username, pass);
    if (user && await this.comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async register(email: string, password: string, username: string): Promise<User> {
    const hashPassword = await this.hashPassword(password);
    const neeUser = {email, password: hashPassword, username }

    return this.prisma.user.create({
      data: neeUser,
    });

  }

  async login(user: any) {
    const payload: any = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id);
    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); 
    
    return {
      access_token: accessToken,
      access_token_expires_at: accessTokenExpiresAt,
      refresh_token: refreshToken.token,
      refresh_token_expires_at: refreshToken.expiresAt,
    };
  }

  async createRefreshToken(userId: string) {
    const token = this.jwtService.sign({ userId }, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dni

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return refreshToken;
  }

  async refreshToken(oldToken: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const payload: any = { userId: refreshToken.userId };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.createRefreshToken(refreshToken.userId);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken.token,
    };
  }

  async invalidateToken(token: string) {
    await this.prisma.jwtBlacklist.create({
      data: { token },
    });
  }

  async validateUserById(userId: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const found = await this.prisma.jwtBlacklist.findUnique({ where: { token } });
    return !!found;
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
