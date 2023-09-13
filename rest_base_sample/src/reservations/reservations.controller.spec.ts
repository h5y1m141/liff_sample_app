import { Test, TestingModule } from '@nestjs/testing'
import { ReservationsController } from './reservations.controller'
import { ReservationsService } from './reservations.service'
import { Reservation } from './entities/reservation.entity'
import { mockReservationRepository } from './reservations.service.spec'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

describe('ReservationsController', () => {
  let controller: ReservationsController

  let mockDataSource: any
  let mockQueryRunner: any
  let mockQueryBuilder: any
  let mockSeatRepository: any

  beforeEach(async () => {
    mockQueryBuilder = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    }

    mockSeatRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn(),
    }

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        getRepository: jest.fn().mockReturnValue(mockSeatRepository),
        update: jest.fn(),
        save: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    }

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useFactory: mockReservationRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile()

    controller = module.get<ReservationsController>(ReservationsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
