import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Название',
  })
  title: string;

  @ApiProperty({
    description: 'Описание',
  })
  description: string;

  @ApiProperty({
    description: 'ID жанров',
    type: [Number],
  })
  genres: number[];
}
