import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { join } from 'path'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      // NOTE: __dirnameが展開されると以下のようなpathの参照になる
      // /rest_base_sample/dist/src/**/*.entity
      entities: [join(__dirname + '/**/*.entity.{js,ts}')],
      synchronize: true,
      logging: true,
    }
  }
}
