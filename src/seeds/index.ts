import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { SeedModule } from './seed.module';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/auth.entity';
import { UserRole } from 'src/common/enums/roles.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const dataSource = app.get(DataSource);

  // Seed Admin
  try {
    const adminRepo = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_USER_PASSWORD,
      10,
    );
    const adminData = {
      firstName: process.env.ADMIN_USER_FIRSTNAME,
      lastName: process.env.ADMIN_USER_LASTNAME,
      email: process.env.ADMIN_USER_EMAIL,
      password: hashedPassword,
      dob: process.env.ADMIN_USER_DOB,
      role: UserRole.ADMIN,
    };
    const existingEmail = await adminRepo.findOne({
      where: { email: adminData.email },
    });

    if (existingEmail) {
      console.log('Admin user already exists');
    } else {
      const newAdmin = adminRepo.create(adminData);
      await adminRepo.save(newAdmin);
      console.log('✅ Admin user seeded');
    }
  } catch (error) {
    console.log('Error in seeding admin user: ', error);
  }

  await app.close();
}

bootstrap();
