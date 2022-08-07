import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    default: 1,
    description: 'The page number',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  readonly page?: number;

  @ApiProperty({
    default: 10,
    description: 'The page size',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  readonly perPage?: number;
}
