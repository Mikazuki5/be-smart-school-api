import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateStudentDTO {
  @IsNotEmpty() @IsUUID()
  classId: string;

  @IsNotEmpty() @IsEmail()
  email: string;

  @IsNotEmpty() @IsString() @MinLength(3)
  username: string;

  @IsNotEmpty() @IsString() @MinLength(6)
  password: string;

  @IsNotEmpty() @IsString() @MinLength(3)
  firstName: string;

  @IsOptional() @IsString()
  lastName: string;
};

export class UpdateStudentDTO {
  @IsOptional() @IsUUID()
  classId?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  username?: string;

  @IsOptional() @IsString()
  password?: string;

  @IsOptional() @IsString()
  firstName?: string;

  @IsOptional() @IsString()
  lastName?: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  gender?: string;

  @IsOptional() @IsString()
  profilePicture?: string;

  @IsOptional() @IsString()
  religion?: string;

  @IsOptional() @IsString()
  phoneNumber?: string;
}