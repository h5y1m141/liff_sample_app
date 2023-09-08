import { IsNumber, IsNotEmpty } from 'class-validator'
export class CreatePaymentIntentDto {
  @IsNotEmpty()
  @IsNumber()
  price: number
}
