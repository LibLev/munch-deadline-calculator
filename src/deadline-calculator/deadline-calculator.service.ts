import { Injectable } from '@nestjs/common';
import { ReportDto } from './dto';
import { ReportTimeException } from './exceptions/report-time.exception';

@Injectable()
export class DeadlineCalculatorService {

    private readonly START_OF_WORK = 9;
    private readonly END_OF_WORK = 17;
    private readonly WORKING_TIME = 8;

    calculateDeadline(dto: ReportDto) {
        this.checkStartDate(dto.date);

        const result = this.getTmpResult(dto.date, dto.duration);

        // Check if the result is after working time
        const isAfterWorkingTime = result.getHours() >= this.END_OF_WORK && result.getMinutes() > 0;

        return isAfterWorkingTime ? this.deadlineOnTheNextDay(result) : result;
    }

    private deadlineOnTheNextDay(localDateTime: Date) {
        let minute = localDateTime.getMinutes();
        let hour = localDateTime.getHours();
        let date = localDateTime.getDate();
        const hourOfNextDay = hour - this.END_OF_WORK + this.START_OF_WORK;
        const newDate = new Date(localDateTime.getFullYear(), localDateTime.getMonth(), date + 1, hourOfNextDay, minute);
        return newDate;
    }

    private getTmpResult(start: Date, time: number) {
        // Calculate the number of days and hours
        const plusDays = Math.floor(time / this.WORKING_TIME);
        const plusHours = time % this.WORKING_TIME;

        // Check if the result is on a weekend
        let newDay = start.getDate() + plusDays;
        let newDate = new Date(start.getFullYear(), start.getMonth(), newDay, start.getHours(), start.getMinutes());
        let dayOfWeek = newDate.getDay();
        let plusWeekendDays = 0;

        switch (dayOfWeek) {
            case 6:
                plusWeekendDays = 2;
                break;
            case 7:
                plusWeekendDays = 1;
                break;
            default:
                break;
        }

        let finalDay = newDay + plusWeekendDays;
        let finalHours = start.getHours() + plusHours;

        return new Date(start.getFullYear(), start.getMonth(), finalDay, finalHours);
    }

    private checkStartDate(start: Date): void {
        if (
            start.getDay() === 6 ||
            start.getDay() === 7 ||
            start.getHours() < this.START_OF_WORK ||
            start.getHours() > this.END_OF_WORK
        ) {
            throw new ReportTimeException();
        }
    }
}
