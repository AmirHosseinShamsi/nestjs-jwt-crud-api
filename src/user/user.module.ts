import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule], //this code makes sure the userRepository is accessible in other modules
})
export class UserModule {}
