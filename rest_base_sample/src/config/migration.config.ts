import 'dotenv/config'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  synchronize: false,
  logging: true,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['migrations/*.ts'],
})
