import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export class CreateSchedulesDTO {
  @IsNotEmpty() @IsEnum(Day)
  day: Day;

  @IsNotEmpty() @IsString()
  startTime: string;

  @IsNotEmpty() @IsString()
  endTime: string;

  @IsNotEmpty() @IsUUID()
  classId: string;

  @IsNotEmpty() @IsUUID()
  teacherId: string;

  @IsNotEmpty() @IsUUID()
  subjectId: string;
}