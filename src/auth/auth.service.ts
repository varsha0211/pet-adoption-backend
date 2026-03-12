import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup(dto: CreateAuthDto) {
    const existingEmail = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      dob: dto.dob,
      email: dto.email,
      phone: dto.phone,
      role: UserRole.USER,
      password: hashedPassword,
    });
    const userData = await this.userRepository.save(user);

    return {
      id: userData.id,
      email: userData.email,
    };
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userRepository.findOneBy({
        email: dto.email,
      });
      if (!user) {
        throw new NotFoundException('Invalid Credetial');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credetial');
      }

      if (!user.isActive) {
        throw new ForbiddenException(
          'Your account is not active yet. Please connect to user for active',
        );
      }

      const token = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          isuser: true,
          isActive: user.isActive,
          role: user.role,
        },
        {
          secret: this.configService.get('jwt.jwtSecret'),
          expiresIn: this.configService.get('jwt.jwtExpiry'),
        },
      );

      const { id, firstName, lastName, email, isActive } = user;
      return {
        id,
        firstName,
        lastName,
        email,
        token,
        isActive,
      };
    } catch (error) {
      throw error;
    }
  }
}
