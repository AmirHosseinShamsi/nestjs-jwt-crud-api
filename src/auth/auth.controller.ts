import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.refreshTokens(refreshDto);
  }
}
