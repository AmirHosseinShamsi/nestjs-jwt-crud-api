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
    try {
      return this.userRepository.createQueryBuilder().getMany();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number): Promise<UserInterface | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
      if (!user) {
        throw new NotFoundException('the user not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<messageInterface> {
    try {
      const createdUser = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserDto)
        .execute();
      return {
        message: `the user with id ${createdUser.identifiers[0].id} created successfully`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAll(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<messageInterface> {
    try {
      const isUserExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
      if (!isUserExists) {
        throw new NotFoundException('the use not found');
      }
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where('id = :id', { id })
        .execute();
      return {
        message: `the user with id ${id} has been updated successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePartial(
    id: number,
    partialUpdateUserDto: PartialUpdateUserDto,
  ): Promise<messageInterface> {
    try {
      const isUserExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
      if (!isUserExists) {
        throw new NotFoundException('the use not found');
      }
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(partialUpdateUserDto)
        .where('id = :id', { id })
        .execute();
      return {
        message: `the user with id ${id} has been updated successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOne(id: number): Promise<messageInterface> {
    try {
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
      return {
        message: `the user with id ${id} has been removed successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
