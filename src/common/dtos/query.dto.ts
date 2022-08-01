import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  readonly perPage?: number;
}
