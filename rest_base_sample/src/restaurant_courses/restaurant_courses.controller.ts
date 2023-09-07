import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { RestaurantCoursesService } from './restaurant_courses.service'
import { CreateRestaurantCourseDto } from './dto/create-restaurant_course.dto'
import { UpdateRestaurantCourseDto } from './dto/update-restaurant_course.dto'

@Controller('restaurant_courses')
export class RestaurantCoursesController {
  constructor(
    private readonly restaurantCoursesService: RestaurantCoursesService,
  ) {}

  @Post()
  create(@Body() createRestaurantCourseDto: CreateRestaurantCourseDto) {
    return this.restaurantCoursesService.create(createRestaurantCourseDto)
  }

  @Get()
  findAll() {
    return this.restaurantCoursesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantCoursesService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantCourseDto: UpdateRestaurantCourseDto,
  ) {
    return this.restaurantCoursesService.update(+id, updateRestaurantCourseDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantCoursesService.remove(+id)
  }
}
