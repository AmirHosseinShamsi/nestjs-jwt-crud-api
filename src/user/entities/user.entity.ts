import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  age: string;

  @OneToOne(() => Address, (address) => address.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @Column({ default: true })
  is_active: boolean;
}
