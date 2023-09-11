import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthchecksService {
  findAll() {
    return true
  }
}
