import { Injectable, Req } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private repository: Repository<Book>,
  ) {}

  create(data: CreateBookDto, userId: number) {
    const book: DeepPartial<Book> = {
      ...data,
      genres: data.genres.map((id) => ({ id })),
    };
    book.user_id = userId;
    return this.repository.save(book);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  update(id: number, data: UpdateBookDto) {
    const book: DeepPartial<Book> = {
      ...data,
      genres: data.genres.map((id) => ({ id })),
    };
    return this.repository.save({ ...book, id });
  }

  async remove(id: number) {
    await this.repository.delete(id);
  }
}
