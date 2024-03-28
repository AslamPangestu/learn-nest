import { Users } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Items {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  category: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column()
  year: number;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Users, (user) => user.items)
  user: Users;
}
