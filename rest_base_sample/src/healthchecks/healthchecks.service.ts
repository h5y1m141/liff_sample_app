import { Injectable } from '@nestjs/common'
import { CreateHealthcheckDto } from './dto/create-healthcheck.dto'
import { UpdateHealthcheckDto } from './dto/update-healthcheck.dto'

@Injectable()
export class HealthchecksService {
  findAll() {
    return true
  }
}
