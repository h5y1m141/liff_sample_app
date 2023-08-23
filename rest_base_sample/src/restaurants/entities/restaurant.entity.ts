import { Seat } from '../../seats/entities/seat.entity'
import { OneToMany, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  readonly id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'timestamptz' })
  created_at

  @Column({ type: 'timestamptz' })
  updated_at

  @OneToMany(() => Seat, (seat) => seat.restaurant)
  seats: Seat[]
}
