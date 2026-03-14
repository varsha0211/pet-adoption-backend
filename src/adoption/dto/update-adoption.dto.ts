import { IsEnum } from 'class-validator';
import { AdoptionStatus } from 'src/common/enums/pets.enum';

export class UpdateAdoptionStatusDto {
  @IsEnum(AdoptionStatus)
  status: AdoptionStatus;
}
