import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  //this app use global pipe validation , class serialize interceptor
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserInterface> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAllUsers(): Promise<UserInterface[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserInterface | null> {
    return this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateUserDto: UpdateUserDto,
  ): Promise<null> {
    return this.userService.updateUser(id, partialUpdateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<null> {
    return this.userService.deleteUserById(id);
  }
}
