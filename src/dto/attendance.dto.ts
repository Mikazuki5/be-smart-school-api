import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  SICK = 'SICK',
  PERMISSION = 'PERMISSION',
  ALPHA = 'ALPHA'
};

class AttendanceStudentItems {
  @IsNotEmpty() @IsUUID()
  studentId: string;

  @IsNotEmpty() @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
};

export class BulkAttendanceStudent {
  @IsNotEmpty() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceStudentItems)
  data: AttendanceStudentItems[];
}

export class SelfAttendaceStudent {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;
};