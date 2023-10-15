import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity({ name: 'genres' })
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Book, (book) => book.genres)
  books: Book[];
}
