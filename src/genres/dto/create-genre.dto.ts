import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Название',
  })
  name: string;
}
