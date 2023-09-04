import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { DataSource, Repository } from 'typeorm'
import { Reservation } from './entities/reservation.entity'
import { Seat } from '../seats/entities/seat.entity'
import { Result } from 'result-type-ts'

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private dataSource: DataSource,
  ) {}

  async create(reservation: CreateReservationDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const seat = await queryRunner.manager
      .getRepository(Seat)
      .createQueryBuilder('seats')
      .setLock('pessimistic_write')
      .where('seats.id = :id', { id: reservation.seat_id })
      .getOne()

    if (seat.number_of_seats === 0) {
      return {
        result: {
          error: 'すでに該当の席は予約されています',
          seat: null,
        },
      }
    }
    await queryRunner.manager.update(Seat, reservation.seat_id, {
      number_of_seats: () => '0',
    })
    const result = Result.success(
      await queryRunner.manager.save(Reservation, {
        ...reservation,
        created_at: new Date(),
        updated_at: new Date(),
      }),
    )

    await queryRunner.commitTransaction()
    if (result.isSuccess) {
      return {
        result: result.value,
        seat,
      }
    } else {
      await queryRunner.rollbackTransaction()
      return {
        result: {
          error: result.error,
        },
        seat: null,
      }
    }
  }

  findAll() {
    return this.reservationRepository.find()
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({
      where: { id },
    })
  }
}
