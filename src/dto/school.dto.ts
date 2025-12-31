import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSchoolDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsString()
  npsn: string;

  @IsOptional() @IsNumber()
  latitude?: number;

  @IsOptional() @IsNumber()
  longitude?: number;

  @IsOptional() @IsNumber()
  radius?: number;
}