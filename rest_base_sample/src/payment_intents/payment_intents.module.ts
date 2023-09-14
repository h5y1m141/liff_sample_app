import { Module } from '@nestjs/common'
import { PaymentIntentsService } from './payment_intents.service'
import { PaymentIntentsController } from './payment_intents.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentIntent } from './entities/payment_intent.entity'
import Stripe from 'stripe'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentIntent])],
  controllers: [PaymentIntentsController],
  providers: [
    PaymentIntentsService,
    {
      provide: Stripe,
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-08-16',
        })
      },
    },
  ],
})
export class PaymentIntentsModule {}
