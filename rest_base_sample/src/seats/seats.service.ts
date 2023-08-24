import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Seat } from './entities/seat.entity'
import { CreateSeatDto } from './dto/create-seat.dto'

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async findAll(): Promise<Seat[]> {
    return this.seatRepository.find({
      relations: ['restaurant'],
    })
  }

  findOne(id: number): Promise<Seat | null> {
    return this.seatRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    })
  }

  async create(seat: CreateSeatDto): Promise<Seat> {
    return this.seatRepository.save({
      ...seat,
      start_at: new Date(seat.start_at),
      end_at: new Date(seat.end_at),
      created_at: new Date(),
      updated_at: new Date(),
    })
  }
}
