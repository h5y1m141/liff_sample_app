import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantCourseDto } from './create-restaurant_course.dto';

export class UpdateRestaurantCourseDto extends PartialType(CreateRestaurantCourseDto) {}
