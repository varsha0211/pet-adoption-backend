import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { QueryPetDto } from './dto/query-pet.dto';
import { PetStatus } from 'src/common/enums/pets.enum';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>) {}

  async create(dto: CreatePetDto) {
    const pet = this.petRepository.create(dto);
    return this.petRepository.save(pet);
  }

  async findAll(query: QueryPetDto) {
    const { search, species, breed, age, page = 1, limit = 10 } = query;

    const qb = this.petRepository
      .createQueryBuilder('pet')
      .where('pet.status =:status', { status: PetStatus.AVAILABLE });

    if (search) {
      qb.andWhere('(pet.name ILIKE :search OR pet.breed ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (species) {
      qb.andWhere('pet.species = :species', { species });
    }
    if (breed) {
      qb.andWhere('pet.breed ILIKE :breed', {
        breed: `%${breed}%`,
      });
    }

    if (age) {
      qb.andWhere('pet.age = :age', { age });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const pet = await this.petRepository.findOne({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async update(id: string, dto: UpdatePetDto) {
    const pet = await this.findOne(id);

    Object.assign(pet, dto);

    return this.petRepository.save(pet);
  }

  async remove(id: string) {
    const pet = await this.findOne(id);

    await this.petRepository.remove(pet);

    return;
  }
}
