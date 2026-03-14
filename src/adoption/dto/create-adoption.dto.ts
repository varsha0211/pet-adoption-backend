import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateAdoptionDto {
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsOptional()
  message?: string;
}
