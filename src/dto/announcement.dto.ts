import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TargetAudience } from "../../prisma/generated/enums";

export class CreateAnnouncement {
  @IsNotEmpty() @IsString()
  title: string;

  @IsNotEmpty() @IsString()
  content: string;

  @IsNotEmpty() @IsEnum(TargetAudience)
  target: TargetAudience;
}