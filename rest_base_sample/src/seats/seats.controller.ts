import { Controller, Get, Param, Post, Body } from '@nestjs/common'

import { SeatsService } from './seats.service'
import { Seat } from './entities/seat.entity'
import { CreateSeatDto } from './dto/create-seat.dto'

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

  @Post()
  create(@Body() params: CreateSeatDto): Promise<Seat> {
    return this.seatsService.create(params)
  }
}
