import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionRequest } from './entities/adoption.entity';
import { AdoptionsController } from './adoption.controller';
import { AdoptionsService } from './adoption.service';
import { Pet } from 'src/pets/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionRequest, Pet])],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionModule {}
