import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantCoursesController } from './restaurant_courses.controller';
import { RestaurantCoursesService } from './restaurant_courses.service';

describe('RestaurantCoursesController', () => {
  let controller: RestaurantCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantCoursesController],
      providers: [RestaurantCoursesService],
    }).compile();

    controller = module.get<RestaurantCoursesController>(RestaurantCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
