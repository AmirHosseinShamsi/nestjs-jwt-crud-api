import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  age: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsIn([Math.random()], {
    message: 'Passwords do not match',
  })
  @ValidateIf((prop) => prop.password !== prop.confirmPassword, {
    message: 'the password does not match',
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
