import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotModule } from './robot/robot.module';
import { Robot } from './robot/entities/robot.entity';

/**
 * App Module
 * 
 * Root module for the Toy Robot Simulator backend API.
 * 
 * This backend serves as a persistence layer for a frontend-driven
 * robot simulator. The frontend handles all robot logic (movement,
 * validation, boundary checking) while this API only stores robot
 * states for history tracking and page refresh restoration.
 * 
 * Features:
 * - SQLite database for simple deployment
 * - Robot state persistence
 * - Movement history tracking
 * - RESTful API endpoints
 */
@Module({
  imports: [
    // SQLite database configuration
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'toy-robot.db', // Local SQLite file
      entities: [Robot], // Register all entities
      synchronize: true, // Auto-create tables (dev only)
    }),
    RobotModule, // Robot feature module
  ],
  controllers: [], // No root controllers (robot endpoints only)
  providers: [], // No global providers needed
})
export class AppModule {}
