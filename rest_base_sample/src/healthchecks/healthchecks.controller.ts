import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { HealthchecksService } from './healthchecks.service'

@Controller('health')
export class HealthchecksController {
  constructor(private readonly healthchecksService: HealthchecksService) {}

  @Get()
  findAll() {
    return this.healthchecksService.findAll()
  }
}
