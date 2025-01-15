import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
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
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
