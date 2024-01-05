import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeadlineCalculatorModule } from './deadline-calculator/deadline-calculator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeadlineCalculatorModule
  ],
})
export class AppModule {}
