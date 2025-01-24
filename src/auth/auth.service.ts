import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ username, password }: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (
      user &&
      (await this.comparePassword(password, user.password, user.email))
    ) {
      return user;
    }
    return null;
  }

  async login(): Promise<{ access_token: string; refresh_token: string }> {
    return {
      //default algorithm is HMAC-SHA256
      access_token: this.jwtService.sign(
        { isEncrypted: true },
        { expiresIn: '5m' },
      ),
      refresh_token: this.jwtService.sign(
        { isEncrypted: true },
        { expiresIn: '10m' },
      ),
    };
  }

  async refreshTokens(
    refreshToken: RefreshDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken.refresh_token);
      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user) throw new UnauthorizedException('invalid refresh token');

      return this.login();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password + salt, hashedPassword);
  }
}
