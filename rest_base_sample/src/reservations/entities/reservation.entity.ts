import {
  OneToOne,
  JoinColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Seat } from '../../seats/entities/seat.entity'

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  readonly id: number

  @Column({ type: 'int4' })
  seat_id

  @Column({ type: 'timestamptz' })
  created_at

  @Column({ type: 'timestamptz' })
  updated_at

  @OneToOne(() => Seat)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat
}
