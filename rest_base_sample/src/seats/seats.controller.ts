import { Controller, Get, Param, Render } from '@nestjs/common'

import { SeatsService } from './seats.service'
import { Seat } from './seats.entity'

type SeatListResponse = {
  seats: Promise<Seat[]>
}

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  async findAll(): Promise<{ seats: Seat[] }> {
    const seats = await this.seatsService.findAll()
    return { seats }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Seat> {
    return this.seatsService.findOne(id)
  }
}
