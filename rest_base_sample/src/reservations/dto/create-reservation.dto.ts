import { IsNumber, IsNotEmpty } from 'class-validator'

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  seat_id: number
}
