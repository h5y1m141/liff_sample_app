import { Test, TestingModule } from '@nestjs/testing'
import { PaymentIntentsService } from './payment_intents.service'
import { DataSource } from 'typeorm'
import Stripe from 'stripe'

// Stripeのモックを初期化
jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        paymentIntents: {
          create: jest.fn(),
        },
      }
    }),
  }
})

describe('PaymentIntentsService', () => {
  let service: PaymentIntentsService
  let stripeInstance: any

  let mockDataSource: any
  let mockQueryRunner: any
  let mockQueryBuilder: any
  let mockSeatRepository: any

  beforeEach(async () => {
    // NOTE

    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    })
    stripeInstance.paymentIntents.create.mockResolvedValue({
      client_secret: 'test_secret',
    })

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

    const mockStripeInstance = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          client_secret: 'test_secret',
        }),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentIntentsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: Stripe,
          useValue: mockStripeInstance,
        },
      ],
    }).compile()

    service = module.get<PaymentIntentsService>(PaymentIntentsService)
  })

  describe('create', () => {
    it('should handle seat reservation and return the result', async () => {
      const dto = {
        price: 2000,
        seat_id: 1,
        restaurant_course_id: 1,
      }
      mockQueryBuilder.getOne.mockResolvedValue({ number_of_seats: 1 })

      const response = await service.create(dto)
      expect(response.secretKey).toEqual('test_secret')
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled()
    })
  })
})
