import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInterface, messageInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<UserInterface[]> {
    return this.userRepository.createQueryBuilder('user').getMany();
  }

  async findOne(id: number): Promise<UserInterface | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException('the user not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<messageInterface> {
    const createdUser = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
      .execute();
    return {
      message: `the user with id ${createdUser.identifiers[0].id} created successfully`,
    };
  }

  async updateAll(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<messageInterface> {
    const isUserExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!isUserExists) {
      throw new NotFoundException('the use not found');
    }
    const updatedUser: any = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();
    if (updatedUser.affected === 0) {
      throw new HttpException('something gone wrong!', HttpStatus.BAD_GATEWAY);
    }
    return { message: `the user with id ${id} has been updated successfully` };
  }

  async updatePartial(
    id: number,
    partialUpdateUserDto: PartialUpdateUserDto,
  ): Promise<messageInterface> {
    const isUserExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!isUserExists) {
      throw new NotFoundException('the use not found');
    }
    const updatedUser: any = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(partialUpdateUserDto)
      .where('id = :id', { id })
      .execute();
    if (updatedUser.affected === 0) {
      throw new HttpException('something gone wrong!', HttpStatus.BAD_GATEWAY);
    }
    return { message: `the user with id ${id} has been updated successfully` };
  }

  async deleteOne(id: number): Promise<messageInterface> {
    const isUserExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!isUserExists) {
      throw new NotFoundException('the use not found');
    }
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
    return { message: `the user with id ${id} has been removed successfully` };
  }
}
