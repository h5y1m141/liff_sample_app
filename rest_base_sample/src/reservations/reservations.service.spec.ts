import { Test, TestingModule } from '@nestjs/testing'
import { ReservationsService } from './reservations.service'
import { Reservation } from './entities/reservation.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

export const mockReservationRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
})

describe('ReservationsService', () => {
  let service: ReservationsService
  let repository: any
  let mockDataSource: any
  let mockQueryRunner: any
  let mockQueryBuilder: any
  let mockSeatRepository: any

  beforeEach(async () => {
    // NOTE
    // テスト間でのモック関数の状態のリセットを容易にするためbeforeEachで定義
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

    service = module.get<ReservationsService>(ReservationsService)
    repository = module.get(getRepositoryToken(Reservation))
  })

  describe('findAll', () => {
    it('メソッドが定義されてる', () => {
      expect(service.findAll).toBeDefined()
    })

    it('repositroyを通じて取得された結果を返す', async () => {
      const result = [{ id: 1, seat_id: 1 }]
      repository.find.mockResolvedValue(result)
      expect(await service.findAll()).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('メソッドが定義されてる', () => {
      expect(service.findOne).toBeDefined()
    })

    it('repositroyを通じて取得された結果を返す', async () => {
      const result = { id: 1, seat_id: 1 }
      repository.findOne.mockResolvedValue(result)
      expect(await service.findOne(result.id)).toEqual(result)
    })
  })

  describe('create', () => {
    it('should handle seat reservation and return the result', async () => {
      const dto = { seat_id: 1, restaurant_course_id: 1 }
      mockQueryBuilder.getOne.mockResolvedValue({ number_of_seats: 1 })

      const response = await service.create(dto)

      expect(mockQueryBuilder.setLock).toHaveBeenCalledWith('pessimistic_write')
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('seats.id = :id', {
        id: dto.seat_id,
      })
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled()
    })
  })
})
