import {
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { Restaurant } from '../../restaurants/entities/restaurant.entity'

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  readonly id: number

  @Column({ type: 'int4' })
  restaurant_id

  @Column({ type: 'int4' })
  number_of_seats

  @Column({ type: 'timestamptz' })
  start_at

  @Column({ type: 'timestamptz' })
  end_at

  @Column({ type: 'timestamptz' })
  created_at

  @Column({ type: 'timestamptz' })
  updated_at

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.seats)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant
}
