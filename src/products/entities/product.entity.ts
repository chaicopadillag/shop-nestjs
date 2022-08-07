import { Image } from './image.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'The unique identifier for a product',
    example: 'ae3bb7d9-acb1-43cb-9b49-691e42fb7aa6',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
    uniqueItems: true,
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'product-name',
    uniqueItems: true,
  })
  @Column({ unique: true, type: 'varchar', length: 255 })
  slug: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100.0,
  })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({
    default: 0,
    description: 'The quantity of the product',
    example: 10,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty()
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty()
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty()
  @Column({ type: 'char', length: 10 })
  gender: string;

  @ApiProperty()
  @OneToMany(() => Image, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images?: Image[];

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  createSlug() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll("'", '')
      .replaceAll(/ /g, '-');
  }

  @BeforeUpdate()
  updateSlug() {
    if (this.slug) {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll("'", '')
        .replaceAll(/ /g, '-');
    }
  }
}
