import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RestaurantsModule } from './restaurants/restaurants.module'
import { SeatsModule } from './seats/seats.module'
import { ConfigModule } from '@nestjs/config'
import { AuthMiddleware } from './middlewares/AuthMiddleware'
import { ReservationsModule } from './reservations/reservations.module'
import { TypeOrmConfigService } from './orm.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RestaurantsModule,
    SeatsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
