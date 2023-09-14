import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Restaurant } from './entities/restaurant.entity'

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({})
  }

  findOne(id: number): Promise<Restaurant | null> {
    return this.restaurantRepository.findOne({
      where: { id },
      relations: ['seats', 'restaurant_courses'],
    })
  }
}
