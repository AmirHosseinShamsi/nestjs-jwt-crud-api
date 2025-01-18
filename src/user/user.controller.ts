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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInterface, messageInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';

@Controller('user')
export class UserController {
  //this app use global pipe validation
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll(): Promise<UserInterface[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserInterface | null> {
    return this.userService.findOne(id);
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.createUser(createUserDto);
  }

  @Put('update/:id')
  async updateAll(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateAll(id, updateUserDto);
  }

  @Patch('update/:id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateUserDto: PartialUpdateUserDto,
  ): Promise<messageInterface> {
    return this.userService.updatePartial(id, partialUpdateUserDto);
  }

  @Delete('delete/:id')
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<messageInterface> {
    return this.userService.deleteOne(id);
  }
}
