import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RestaurantsModule } from './restaurants/restaurants.module'
import { SeatsModule } from './seats/seats.module'
import { Restaurant } from './restaurants/restaurants.entity'
import { Seat } from './seats/seats.entity'
import { ConfigModule } from '@nestjs/config'
import { AuthMiddleware } from './middlewares/AuthMiddleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [Restaurant, Seat],
      synchronize: true,
    }),
    RestaurantsModule,
    SeatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
