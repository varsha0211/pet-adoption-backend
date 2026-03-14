import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PetSpecies } from 'src/common/enums/pets.enum';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(PetSpecies)
  species: PetSpecies;

  @IsNotEmpty()
  @IsString()
  breed: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
