import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateDepartmentDTO {
  @IsNotEmpty() @IsString()
  name: string;
}

export class CreateClassDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsInt() @Min(10) @Max(12)
  gradeLevel: number;

  @IsNotEmpty() @IsUUID()
  departmentId: string;
}