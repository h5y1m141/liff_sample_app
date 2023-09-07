import { Injectable } from '@nestjs/common'
import { CreatePaymentIntentDto } from './dto/create-payment_intent.dto'
import { UpdatePaymentIntentDto } from './dto/update-payment_intent.dto'
import Stripe from 'stripe'

@Injectable()
export class PaymentIntentsService {
  async create(createPaymentIntentDto: CreatePaymentIntentDto) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    })

    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
        amount: 50, // 最低限の金額である50円を仮設定
        currency: 'jpy',
      })

    return { secretKey: paymentIntent.client_secret }
  }

  findAll() {
    return `This action returns all paymentIntents`
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentIntent`
  }

  update(id: number, updatePaymentIntentDto: UpdatePaymentIntentDto) {
    return `This action updates a #${id} paymentIntent`
  }

  remove(id: number) {
    return `This action removes a #${id} paymentIntent`
  }
}
