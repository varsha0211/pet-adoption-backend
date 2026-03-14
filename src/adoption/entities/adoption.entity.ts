import { User } from 'src/auth/entities/auth.entity';
import { AdoptionStatus } from 'src/common/enums/pets.enum';
import { Pet } from 'src/pets/entities/pet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Unique(['user', 'pet'])
@Entity('adoption_requests')
export class AdoptionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AdoptionStatus,
    default: AdoptionStatus.PENDING,
  })
  status: AdoptionStatus;

  @Column({ type: 'text', nullable: true })
  message: string;

  @ManyToOne(() => User, (user) => user.adoptionRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Pet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
