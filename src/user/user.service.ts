import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { messageInterface, UserInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserInterface[]> {
    /*return this.userRepository.createQueryBuilder().getMany();*/
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .getMany();
  }

  async findOne(id: number): Promise<UserInterface | null> {
    const user: UserInterface = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.address', 'address')
      .getOne();
    if (!user) {
      throw new NotFoundException('the user not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<messageInterface> {
    const { first_name, last_name, age } = createUserDto;
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
    /*const createdUser = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(newUser)
      .execute();*/
    const returnedUser: UserInterface = await this.userRepository.save(newUser);
    console.log(returnedUser);
    return {
      message: `the user with id ${1} created successfully`,
    };
  }

  async updateAll(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<messageInterface> {
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException('The user not found');
    }
    return {
      message: `the user with id ${id} has been updated successfully`,
    };
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
