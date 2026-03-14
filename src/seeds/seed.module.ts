import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'src/database/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  providers: [ConfigService],
})
export class SeedModule {}
