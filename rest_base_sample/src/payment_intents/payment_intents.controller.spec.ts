import { Test, TestingModule } from '@nestjs/testing'
import { PaymentIntentsController } from './payment_intents.controller'
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

describe('PaymentIntentsController', () => {
  let controller: PaymentIntentsController
  let stripeInstance: any

  let mockDataSource: any
  let mockQueryRunner: any
  let mockQueryBuilder: any
  let mockSeatRepository: any

  beforeEach(async () => {
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
      controllers: [PaymentIntentsController],
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

    controller = module.get<PaymentIntentsController>(PaymentIntentsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
