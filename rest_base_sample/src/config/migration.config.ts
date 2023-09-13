import 'dotenv/config'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: 'containers-us-west-40.railway.app',
  port: 7442,
  synchronize: false,
  logging: true,
  username: 'postgres',
  password: 'gRABwgb9yrv5VhDFRjc3',
  database: 'railway',
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['migrations/*.ts'],
})
