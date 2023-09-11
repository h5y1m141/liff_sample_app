import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { join } from 'path'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // NOTE: __dirnameが展開されると以下のようなpathの参照になる
      // /rest_base_sample/dist/src/**/*.entity
      entities: [join(__dirname + '/**/*.entity.{js,ts}')],
      synchronize: true,
      logging: true,
    }
  }
}
