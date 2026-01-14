import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsUUID, Max, Min, ValidateNested } from "class-validator";

class StudentGradesItem {
  @IsNotEmpty() @IsUUID()
  studentId: string;

  @IsNumber() @Min(0) @Max(100)
  dailyWork: number;

  @IsNumber() @Min(0) @Max(100)
  practicalWork: number;
  
  @IsNumber() @Min(0) @Max(100)
  assignment: number;

  @IsNumber() @Min(0) @Max(100)
  midtermExam: number;

  @IsNumber() @Min(0) @Max(100)
  finalExam: number;

  @IsNumber() @Min(0) @Max(100)
  practicalExam: number;
};

export class BulkGradeInputDTO {
  @IsNotEmpty() @IsUUID()
  subjectId: string;

  @IsNotEmpty() @IsNumber()
  semester: number;

  @IsNotEmpty() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentGradesItem)
  data: StudentGradesItem
}