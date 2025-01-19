import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
