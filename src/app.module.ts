import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { AdoptionModule } from './adoption/adoption.module';
import configuration from './common/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          logging: true,
          synchronize: false, // This auto-generates tables, set to false in production mode
        };

        return config;
      },
      inject: [ConfigService],
    }),

    AuthModule,
    PetsModule,
    AdoptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
