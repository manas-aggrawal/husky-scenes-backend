import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { STAGE, FRONT_END_BASE_URL } from './common/constants/app.constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use global pipes
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not included in the DTO
      forbidNonWhitelisted: true, // Throw error for unexpected properties
      transform: true, // Automatically transform payloads into DTO instances
    }),
  );

  // Setting CORS
  app.enableCors({
    origin:
      STAGE === 'dev'
        ? ['http://localhost:8000', `https://${FRONT_END_BASE_URL}`]
        : [`https://${FRONT_END_BASE_URL}`],
    credentials: true,
    methods: '*',
    optionsSuccessStatus: 201,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('App listening at http://localhost:3000');
}
bootstrap();
