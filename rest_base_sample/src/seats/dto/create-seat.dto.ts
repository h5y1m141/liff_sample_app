import { IsNumber, IsNotEmpty } from 'class-validator'

export class CreateSeatDto {
  @IsNotEmpty()
  @IsNumber()
  number_of_seats: number

  @IsNotEmpty()
  start_at: string

  @IsNotEmpty()
  end_at: string

  @IsNotEmpty()
  @IsNumber()
  restaurant_id: number
}
