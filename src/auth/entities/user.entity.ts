import { Product } from 'src/products/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', array: true, default: [] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
