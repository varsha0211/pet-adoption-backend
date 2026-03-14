import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionRequest } from './entities/adoption.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionStatus, PetStatus } from 'src/common/enums/pets.enum';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(AdoptionRequest)
    private adoptionRepo: Repository<AdoptionRequest>,
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
  ) {}

  // User applies for adoption
  async create(user: string, dto: CreateAdoptionDto) {
    const pet = await this.petRepo.findOne({
      where: { id: dto.petId },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    if (pet.status !== PetStatus.AVAILABLE) {
      throw new BadRequestException('Pet not available');
    }

    const existing = await this.adoptionRepo.findOne({
      where: {
        user: { id: user },
        pet: { id: dto.petId },
      },
    });

    if (existing) {
      throw new BadRequestException('Already applied for this pet');
    }

    const adoption = this.adoptionRepo.create({
      user: { id: user },
      pet,
      message: dto.message,
    });

    pet.status = PetStatus.PENDING;
    await this.petRepo.save(pet);
    return this.adoptionRepo.save(adoption);
  }

  // User views their requests
  async findMyRequests(userId: string) {
    return this.adoptionRepo.find({
      where: { user: { id: userId } },
      relations: ['pet'],
      order: { createdAt: 'DESC' },
    });
  }

  // Admin views all requests
  async findAll() {
    return this.adoptionRepo.find({
      relations: ['user', 'pet'],
      order: { createdAt: 'DESC' },
    });
  }

  // Admin approve / reject
  async updateStatus(id: string, status: AdoptionStatus) {
    const adoption = await this.adoptionRepo.findOne({
      where: { id },
      relations: ['pet'],
    });

    if (!adoption) {
      throw new NotFoundException('Adoption request not found');
    }

    adoption.status = status;

    if (status === AdoptionStatus.APPROVED) {
      adoption.pet.status = PetStatus.ADOPTED;
      await this.petRepo.save(adoption.pet);
    }

    return this.adoptionRepo.save(adoption);
  }
}
