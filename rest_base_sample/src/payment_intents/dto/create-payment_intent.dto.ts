import { IsNumber, IsNotEmpty } from 'class-validator'
export class CreatePaymentIntentDto {
  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsNumber()
  seat_id: number

  @IsNotEmpty()
  @IsNumber()
  restaurant_course_id: number
}
