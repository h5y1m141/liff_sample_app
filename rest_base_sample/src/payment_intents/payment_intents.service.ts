import { Injectable } from '@nestjs/common'
import { CreatePaymentIntentDto } from './dto/create-payment_intent.dto'
import { UpdatePaymentIntentDto } from './dto/update-payment_intent.dto'
import { DataSource } from 'typeorm'
import { Reservation } from '../reservations/entities/reservation.entity'
import { Seat } from '../seats/entities/seat.entity'
import { Result } from 'result-type-ts'
import Stripe from 'stripe'

@Injectable()
export class PaymentIntentsService {
  constructor(private dataSource: DataSource, private stripe: Stripe) {}

  async create(createPaymentIntentDto: CreatePaymentIntentDto) {
    const paymentIntent: Stripe.PaymentIntent =
      await this.stripe.paymentIntents.create({
        amount: createPaymentIntentDto.price,
        currency: 'jpy',
      })

    if (paymentIntent) {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const seat = await queryRunner.manager
        .getRepository(Seat)
        .createQueryBuilder('seats')
        .setLock('pessimistic_write')
        .where('seats.id = :id', { id: createPaymentIntentDto.seat_id })
        .getOne()

      if (seat.number_of_seats === 0) {
        return {
          result: {
            error: 'すでに該当の席は予約されています',
            seat: null,
          },
        }
      }
      await queryRunner.manager.update(Seat, createPaymentIntentDto.seat_id, {
        number_of_seats: () => '0',
      })
      const result = Result.success(
        await queryRunner.manager.save(Reservation, {
          seat_id: createPaymentIntentDto.seat_id,
          restaurant_course_id: createPaymentIntentDto.restaurant_course_id,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      )

      await queryRunner.commitTransaction()
      if (result.isSuccess) {
        return {
          secretKey: paymentIntent.client_secret,
          result: result.value,
          seat,
        }
      } else {
        await queryRunner.rollbackTransaction()
        return {
          secretKey: paymentIntent.client_secret,
          result: {
            error: result.error,
          },
          seat: null,
        }
      }
    } else {
      return { secretKey: null, result: null, seat: null }
    }
  }
}
