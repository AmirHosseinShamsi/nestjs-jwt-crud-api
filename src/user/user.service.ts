import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    // Hash password with salt
    return await bcrypt.hash(password + salt, 10);
  }

  async findAllUsers(): Promise<UserInterface[]> {
    return this.userRepository.createQueryBuilder('user').getMany();
  }

  async findUserById(id: number): Promise<UserInterface | null> {
    const user = await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException('the user not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const { password, confirmPassword, email, username } = createUserDto;
    /*const { city, street, postal_code } = createUserDto.address;*/
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
    const hashedPassword: string = await this.hashPassword(password, email);
    /*const newAddress = new Address();
    newAddress.city = city;
    newAddress.street = street;
    newAddress.postal_code = postal_code;*/
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  //TODO : add password and confirm password to the update user
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<null> {
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return null;
  }

  async changePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<null> {
    const { password, confirmPassword } = updatePasswordDto;
    const isPasswordMatch: boolean = password === confirmPassword;
    if (!isPasswordMatch) {
      throw new HttpException(
        'the password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userEmail = await this.userRepository
      .createQueryBuilder('user')
      .select('user.email')
      .where('user.id = :id', { id })
      .getOne();
    const hashedPassword: string = await this.hashPassword(
      password,
      userEmail.email,
    );
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where('id = :id', { id })
      .execute();
    return null;
  }

  async deleteUserById(id: number): Promise<null> {
    const deletedResult: DeleteResult = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
    if (deletedResult.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return null;
  }
}
