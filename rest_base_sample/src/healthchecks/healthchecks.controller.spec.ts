import { Test, TestingModule } from '@nestjs/testing';
import { HealthchecksController } from './healthchecks.controller';
import { HealthchecksService } from './healthchecks.service';

describe('HealthchecksController', () => {
  let controller: HealthchecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthchecksController],
      providers: [HealthchecksService],
    }).compile();

    controller = module.get<HealthchecksController>(HealthchecksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
