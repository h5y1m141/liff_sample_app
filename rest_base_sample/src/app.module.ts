import {
  MiddlewareConsumer,
  Module,
  NestModule,
  // RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RestaurantsModule } from './restaurants/restaurants.module'
import { SeatsModule } from './seats/seats.module'
import { ConfigModule } from '@nestjs/config'
// import { AuthMiddleware } from './middlewares/AuthMiddleware'
import { ReservationsModule } from './reservations/reservations.module'
import { TypeOrmConfigService } from './orm.config'
import { PaymentIntentsModule } from './payment_intents/payment_intents.module'
import { RestaurantCoursesModule } from './restaurant_courses/restaurant_courses.module'

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
    PaymentIntentsModule,
    RestaurantCoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude(
    //     { path: 'restaurants', method: RequestMethod.GET },
    //     { path: 'restaurants/:id', method: RequestMethod.GET },
    //   )
    //   .forRoutes('*')
  }
}
