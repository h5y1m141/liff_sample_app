import { IsNumber, IsNotEmpty } from 'class-validator'

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  seat_id: number

  @IsNotEmpty()
  @IsNumber()
  restaurant_course_id: number
}
