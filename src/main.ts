import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import morgan from 'morgan';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './common/middleware/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: configService.get('cors.origins')?.split(',') || [''],
  //   methods: 'GET,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });

  const config = new DocumentBuilder()
    .setTitle('Pet Adoption API')
    .setDescription('API documentation for Pet Adoption System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(morgan('tiny'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        // const i18n = I18nContext.current();
        console.error('error: ', errors);
        const extractMessages = (
          validationErrors: ValidationError[],
        ): string[] => {
          const messages: string[] = [];
          validationErrors.forEach((error) => {
            if (error.constraints) {
              messages.push(...Object.values(error.constraints));
            }
            if (error.children && error.children.length > 0) {
              messages.push(...extractMessages(error.children));
            }
          });
          return messages;
        };

        const errorMessages = extractMessages(errors).join(', ');
        return new HttpException(errorMessages, HttpStatus.BAD_REQUEST);
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('_______________Server connected with database_______________');
  } else {
    console.error('Database connection failed');
    process.exit(1);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
