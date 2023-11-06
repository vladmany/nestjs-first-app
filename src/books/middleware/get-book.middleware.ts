import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { BooksService } from '../books.service';
import BookRequest from '../book-request.interface';

@Injectable()
export class GetBookMiddleware implements NestMiddleware {
  constructor(private readonly booksService: BooksService) {}

  async use(req: BookRequest, res: Response, next: NextFunction) {
    const bookId = +req.params.id;
    const book = await this.booksService.findOne(bookId);

    if (!book) {
      return res.status(404).send();
    }

    req.book = book;
    next();
  }
}
