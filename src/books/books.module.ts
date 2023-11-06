import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { GetBookMiddleware } from './middleware/get-book.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(GetBookMiddleware)
      .forRoutes(
        { path: 'books/:id', method: RequestMethod.DELETE },
        { path: 'books/:id', method: RequestMethod.PATCH },
      );
  }
}
