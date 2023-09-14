import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PaymentIntentsService } from './payment_intents.service'
import { CreatePaymentIntentDto } from './dto/create-payment_intent.dto'
import { UpdatePaymentIntentDto } from './dto/update-payment_intent.dto'

@Controller('payment_intents')
export class PaymentIntentsController {
  constructor(private readonly paymentIntentsService: PaymentIntentsService) {}

  @Post()
  create(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentIntentsService.create(createPaymentIntentDto)
  }
}
