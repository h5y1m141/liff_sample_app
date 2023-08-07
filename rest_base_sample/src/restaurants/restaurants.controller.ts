import { Controller, Get, Param, Render } from '@nestjs/common'

import { RestaurantsService } from './restaurants.service'
import { Restaurant } from './restaurants.entity'

type RestaurantListResponse = {
  restaurants: Promise<Restaurant[]>
}

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Render('restaurants/index')
  async findAll(): Promise<{ restaurants: Restaurant[] }> {
    const restaurants = await this.restaurantsService.findAll()
    return { restaurants }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Restaurant> {
    return this.restaurantsService.findOne(id)
  }
}
