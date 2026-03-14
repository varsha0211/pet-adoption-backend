import { IsOptional } from 'class-validator';

export class QueryPetDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  species?: string;

  @IsOptional()
  breed?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
