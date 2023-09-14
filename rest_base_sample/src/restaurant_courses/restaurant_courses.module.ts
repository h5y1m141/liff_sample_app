import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RestaurantCoursesService } from './restaurant_courses.service'
import { RestaurantCoursesController } from './restaurant_courses.controller'
import { RestaurantCourse } from './entities/restaurant_course.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantCourse])],
  controllers: [RestaurantCoursesController],
  providers: [RestaurantCoursesService],
})
export class RestaurantCoursesModule {}
