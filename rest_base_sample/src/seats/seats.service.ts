import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Seat } from './seats.entity'

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
    return this.seatRepository.findOneBy({ id })
  }
}
