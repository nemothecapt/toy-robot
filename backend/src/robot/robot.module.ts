import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from './entities/robot.entity';
import { RobotService } from './services/robot.service';
import { RobotController } from './controllers/robot.controller';

/**
 * Robot Module
 * 
 * Configures the robot feature module with all its dependencies.
 * Handles robot state persistence in a frontend-driven architecture.
 * 
 * Architecture:
 * - Controller: HTTP endpoints for robot API
 * - Service: Database operations and business logic
 * - Entity: Robot data model and validation
 * - DTO: Input validation for API requests
 */
@Module({
  imports: [TypeOrmModule.forFeature([Robot])], // Register Robot entity with TypeORM
  controllers: [RobotController], // HTTP request handlers
  providers: [RobotService], // Business logic and database operations
  exports: [RobotService], // Make service available to other modules if needed
})
export class RobotModule {} 