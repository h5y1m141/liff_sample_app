import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateRestaurantCourseDto } from './dto/create-restaurant_course.dto'
import { UpdateRestaurantCourseDto } from './dto/update-restaurant_course.dto'
import { RestaurantCourse } from './entities/restaurant_course.entity'

@Injectable()
export class RestaurantCoursesService {
  constructor(
    @InjectRepository(RestaurantCourse)
    private restaurantCourseRepository: Repository<RestaurantCourse>,
  ) {}

  create(createRestaurantCourseDto: CreateRestaurantCourseDto) {
    return 'This action adds a new restaurantCourse'
  }

  async findAll(): Promise<RestaurantCourse[]> {
    return this.restaurantCourseRepository.find({
      relations: ['restaurant'],
    })
  }

  async findOne(id: number): Promise<RestaurantCourse | null> {
    return this.restaurantCourseRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    })
  }

  update(id: number, updateRestaurantCourseDto: UpdateRestaurantCourseDto) {
    return `This action updates a #${id} restaurantCourse`
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantCourse`
  }
}
