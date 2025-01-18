import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

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

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '90d' }),
    };
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password + salt, hashedPassword);
  }
}
