import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { messageInterface, UserInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Address } from './entities/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    // Hash password with salt
    return await bcrypt.hash(password + salt, 10);
  }

  async findAll(): Promise<UserInterface[]> {
    return this.userRepository.find({
      relations: {
        address: true,
      },
    });
  }

  async findOne(id: number): Promise<UserInterface | null> {
    const user = await this.userRepository.findOne({
      relations: {
        address: true,
      },
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('the user not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    /*const { first_name, last_name, age } = createUserDto;
    const { city, street, postal_code } = createUserDto.address;
    const newAddress = new Address();
    newAddress.city = city;
    newAddress.street = street;
    newAddress.postal_code = postal_code;
    const newUser = new User();
    newUser.first_name = first_name;
    newUser.last_name = last_name;
    newUser.age = age;
    newUser.address = newAddress;
    return this.userRepository.save(newUser);*/
    const { password, confirmPassword, email, username } = createUserDto;
    const { city, street, postal_code } = createUserDto.address;
    const isUserNameEmailExistence = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username,
        email,
      })
      .getRawOne();
    const isPasswordMatch: boolean = password === confirmPassword;
    if (isUserNameEmailExistence || !isPasswordMatch) {
      throw new HttpException(
        'user existence credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.hashPassword(password, email);
    const newAddress = new Address();
    newAddress.city = city;
    newAddress.street = street;
    newAddress.postal_code = postal_code;
    const user = this.userRepository.create({
      ...createUserDto,
      ...newAddress,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateAll(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const updated = await this.userRepository.update(id, updateUserDto);
    console.log(updated);
    /*if (updated.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return {
      message: `the user with id ${id} has been updated successfully`,
    };*/
  }

  async updatePartial(
    id: number,
    partialUpdateUserDto: PartialUpdateUserDto,
  ): Promise<messageInterface> {
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(partialUpdateUserDto)
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return {
      message: `the user with id ${id} has been updated successfully`,
    };
  }

  async deleteOne(id: number): Promise<messageInterface> {
    /*const deletedResult: DeleteResult = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();*/
    const deletedResult: DeleteResult = await this.userRepository.delete(id);
    if (deletedResult.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return {
      message: `the user with id ${id} has been removed successfully`,
    };
  }
}
