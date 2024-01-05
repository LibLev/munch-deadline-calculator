import { Module } from "@nestjs/common";
import { DeadlineCalculatorController } from "./deadline-calculator.controller";
import { DeadlineCalculatorService } from "./deadline-calculator.service";

@Module({
  controllers: [DeadlineCalculatorController],
  providers: [DeadlineCalculatorService]
})
export class DeadlineCalculatorModule {
}