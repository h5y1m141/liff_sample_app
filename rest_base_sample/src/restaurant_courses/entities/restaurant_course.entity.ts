import {
  ManyToOne,
  JoinColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Restaurant } from '../../restaurants/entities/restaurant.entity'

@Entity('restaurant_courses')
export class RestaurantCourse {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  readonly id: number

  @Column({ type: 'int4' })
  restaurant_id

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int4' })
  price

  @Column({ type: 'timestamptz' })
  created_at

  @Column({ type: 'timestamptz' })
  updated_at

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.seats)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant
}
