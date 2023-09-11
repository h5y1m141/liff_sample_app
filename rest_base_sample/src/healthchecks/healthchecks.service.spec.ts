import { Test, TestingModule } from '@nestjs/testing';
import { HealthchecksService } from './healthchecks.service';

describe('HealthchecksService', () => {
  let service: HealthchecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthchecksService],
    }).compile();

    service = module.get<HealthchecksService>(HealthchecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
