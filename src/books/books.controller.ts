import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EditGuard } from './guards/edit.guard';
import BookRequest from './book-request.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './entities/book.entity';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiResponse({ status: 201, description: 'Книга создана', type: Book })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookDto: CreateBookDto, @Request() req) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @ApiResponse({ status: 200, description: 'Список книг получен', type: [Book] })
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Книга получена', type: Book })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @ApiResponse({ status: 201, description: 'Книга изменена', type: Book })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EditGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @ApiResponse({ status: 200, description: 'Книга удалена' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EditGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: BookRequest) {
    return this.booksService.remove(+id);
  }
}
