import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Toy Robot Simulator Backend
 * 
 * Bootstrap function for the NestJS application.
 * Configures CORS, validation, and starts the server on port 3000.
 * 
 * This backend serves as a persistence layer for the frontend-driven
 * robot simulator, providing API endpoints for robot state management.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true,
  });
  
  // Add global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Start server on port 3000 (or environment PORT)
  await app.listen(process.env.PORT ?? 3000);
  console.log('🤖 Robot Simulator Backend running on http://localhost:3000');
}
bootstrap();
