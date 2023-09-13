import { Test, TestingModule } from '@nestjs/testing'
import { RestaurantCoursesService } from './restaurant_courses.service'
import { RestaurantCourse } from './entities/restaurant_course.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

const mockRestaurantCourseRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
})

describe('RestaurantCoursesService', () => {
  let service: RestaurantCoursesService
  let repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantCoursesService,
        {
          provide: getRepositoryToken(RestaurantCourse),
          useFactory: mockRestaurantCourseRepository,
        },
      ],
    }).compile()

    service = module.get<RestaurantCoursesService>(RestaurantCoursesService)
    repository = module.get(getRepositoryToken(RestaurantCourse))
  })

  describe('findAll', () => {
    it('メソッドが定義されてる', () => {
      expect(service.findAll).toBeDefined()
    })

    it('コースに関連するレストランのrelationの情報も含めて呼ばれる', async () => {
      service.findAll()
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['restaurant'],
      })
    })

    it('repositroyを通じて取得された結果を返す', async () => {
      const result = [{ id: 1, name: 'すし大崎' }]
      repository.find.mockResolvedValue(result)
      expect(await service.findAll()).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('メソッドが定義されてる', () => {
      expect(service.findOne).toBeDefined()
    })

    it('コースに関連するレストランのrelationの情報も含めて呼ばれる', async () => {
      const id = 1
      service.findOne(id)
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['restaurant'],
        where: { id },
      })
    })

    it('repositroyを通じて取得された結果を返す', async () => {
      const result = { id: 1, name: 'すし大崎' }
      repository.findOne.mockResolvedValue(result)
      expect(await service.findOne(result.id)).toEqual(result)
    })
  })
})
