import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdoptionsService } from './adoption.service';
import { JwtAuthGuard } from 'src/common/strategy/jwt-auth.guard';
import { UserRole } from 'src/common/enums/roles.enum';
import { UpdateAdoptionStatusDto } from './dto/update-adoption.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private adoptionService: AdoptionsService) {}

  // User apply adoption
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateAdoptionDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.adoptionService.create(req.user.userId, dto);
  }

  // User view own requests
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.adoptionService.findMyRequests(req.user.userId);
  }

  // Admin view all applications
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.adoptionService.findAll();
  }

  // Admin approve / reject
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAdoptionStatusDto) {
    return this.adoptionService.updateStatus(id, dto.status);
  }
}
