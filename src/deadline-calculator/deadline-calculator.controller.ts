import { Body, Controller, Get } from "@nestjs/common";
import { ReportDto } from "./dto";
import { DeadlineCalculatorService } from "./deadline-calculator.service";

@Controller("deadline-calculator")
export class DeadlineCalculatorController {


  constructor(private deadlineService: DeadlineCalculatorService) {
  }

  @Get()
  getDeadline(@Body() dto: ReportDto) {
    //date format is: yyyy-MM-ddTHH:mm
    return this.deadlineService.calculateDeadline(dto);
  }
}
