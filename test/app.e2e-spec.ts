import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { ReportDto } from "src/deadline-calculator/dto";

describe("App e2e", () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule]
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );
    await app.init;
    await app.listen(3333);

    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(() => {
    app.close();
  });

  describe("Deadline calculator", () => {
    describe("Send report", () => {
      it("test for week day", () => {
        const dto: ReportDto = {
          date: "2024-01-04T10:00",
          duration: 6
        };
        return pactum
          .spec()
          .get("/deadline-calculator")
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains("1/4/2024, 4:00:00 PM");
      });

      it("test for weekend", () => {
        const dto: ReportDto = {
          date: "2024-01-05T10:00",
          duration: 8
        };
        return pactum
          .spec()
          .get("/deadline-calculator")
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains("1/8/2024, 10:00:00 AM");
      });

      it("test for next day", () => {
        const dto: ReportDto = {
          date: "2024-01-04T10:00",
          duration: 8
        };
        return pactum
          .spec()
          .get("/deadline-calculator")
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains("1/5/2024, 10:00:00 AM");
      });

      it("test for end of the month", () => {
        const dto: ReportDto = {
          date: "2024-01-31T10:00",
          duration: 8
        };
        return pactum
          .spec()
          .get("/deadline-calculator")
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains("2/1/2024, 10:00:00 AM");
      });

      it("test for report sent on weekend throw exception", () => {
        const dto: ReportDto = {
          date: "2024-01-6T10:00",
          duration: 6
        };
        return pactum
          .spec()
          .get("/deadline-calculator")
          .withBody(dto)
          .expectBodyContains("Invalid Date");
      });
    });
  });


});
