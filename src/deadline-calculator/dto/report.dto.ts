import { IsNotEmpty } from "class-validator";

export class ReportDto {
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  duration: number;
}