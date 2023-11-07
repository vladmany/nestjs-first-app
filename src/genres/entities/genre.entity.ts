import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'genres' })
export class Genre {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Book, (book) => book.genres)
  books: Book[];
}
