import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { ReportDto } from 'src/deadline-calculator/dto';

describe('App e2e', () =>{
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef =
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init;
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  })

  afterAll(() => {
    app.close();
  });

  describe('Deadline calculator', () => {
    describe('Report on weekend', () => {
      it('should throw exception', () => {
        const dto: ReportDto = {
          date: new Date(2024, 1, 4, 11, 25),
          duration: 6
        }
        return pactum
          .spec()
          .get('/deadline-calculator')
          .withBody(dto)
          .inspect
      });
    });
  })


})
