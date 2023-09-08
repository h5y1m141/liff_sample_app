import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantCoursesService } from './restaurant_courses.service';

describe('RestaurantCoursesService', () => {
  let service: RestaurantCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantCoursesService],
    }).compile();

    service = module.get<RestaurantCoursesService>(RestaurantCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
