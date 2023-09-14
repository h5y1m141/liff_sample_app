import { Test, TestingModule } from '@nestjs/testing'
import { RestaurantCoursesController } from './restaurant_courses.controller'
import { RestaurantCoursesService } from './restaurant_courses.service'
import { RestaurantCourse } from './entities/restaurant_course.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

const mockRestaurantCourseRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
})

describe('RestaurantCoursesController', () => {
  let controller: RestaurantCoursesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantCoursesController],
      providers: [
        RestaurantCoursesService,
        {
          provide: getRepositoryToken(RestaurantCourse),
          useFactory: mockRestaurantCourseRepository,
        },
      ],
    }).compile()

    controller = module.get<RestaurantCoursesController>(
      RestaurantCoursesController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
