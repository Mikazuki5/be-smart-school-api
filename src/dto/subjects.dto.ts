import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectsDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsString()
  code: string;
};

export class CreateSubjectsWithTeacherDTO {
  @IsNotEmpty() @IsArray()
  teacherIds: string[];

  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsString()
  code: string;
}