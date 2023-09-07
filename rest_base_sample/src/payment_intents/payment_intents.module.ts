import { Module } from '@nestjs/common';
import { PaymentIntentsService } from './payment_intents.service';
import { PaymentIntentsController } from './payment_intents.controller';

@Module({
  controllers: [PaymentIntentsController],
  providers: [PaymentIntentsService]
})
export class PaymentIntentsModule {}
