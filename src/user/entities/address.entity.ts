import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  city: string;
  @Column()
  street: string;
  @Column()
  postal_code: string;
}
