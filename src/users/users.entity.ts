import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Items } from 'src/items/items.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Items, (item) => item.user)
  items: Items[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User id: ${this.id}`);
  }
}
