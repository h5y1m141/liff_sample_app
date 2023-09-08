import { Module } from '@nestjs/common'
import { PaymentIntentsService } from './payment_intents.service'
import { PaymentIntentsController } from './payment_intents.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentIntent } from './entities/payment_intent.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentIntent])],
  controllers: [PaymentIntentsController],
  providers: [PaymentIntentsService],
})
export class PaymentIntentsModule {}
