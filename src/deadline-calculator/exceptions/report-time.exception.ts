import { NotAcceptableException } from "@nestjs/common";

export class ReportTimeException extends NotAcceptableException {
    constructor() {
      super('Errors can only be reported on working days between 9am and 5pm');
    }
  }