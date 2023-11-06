import { Request } from 'express';
import { Book } from './entities/book.entity'; // Подставьте соответствующую модель вашей книги

interface BookRequest extends Request {
  book?: Book;
}

export default BookRequest;
