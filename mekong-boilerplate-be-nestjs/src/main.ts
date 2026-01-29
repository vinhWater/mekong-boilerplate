import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'], // Enable debug logs
  });

  // Configure CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTO
      transform: true, // Automatically transform data types
      forbidNonWhitelisted: true, // Report error if properties not defined
    }),
  );

  // Configure Swagger only in development mode
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('TikTok Shop API')
      .setDescription('TikTok Shop API description')
      .setVersion('1.0')
      .addBearerAuth() // Add JWT authentication support
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    console.log('🚀 Swagger UI is available at: http://localhost:' + (process.env.PORT ?? 3000) + '/api');
  } else {
    console.log('🔒 Swagger UI is disabled in production mode for security');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
