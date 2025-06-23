import { IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Direction } from '../entities/robot.entity';

/**
 * Place Robot Data Transfer Object
 * 
 * Validates incoming robot state data from the frontend.
 * Ensures coordinates are within the 5x5 grid bounds and
 * direction is one of the valid cardinal directions.
 * 
 * Used by the /robot/move endpoint for input validation.
 */
export class PlaceRobotDto {
  /** X coordinate (0-4, left to right on the grid) */
  @IsNumber()
  @Min(0) // Left boundary
  @Max(4) // Right boundary
  x: number;

  /** Y coordinate (0-4, bottom to top on the grid) */
  @IsNumber()
  @Min(0) // Bottom boundary
  @Max(4) // Top boundary
  y: number;

  /** Robot facing direction (NORTH, SOUTH, EAST, or WEST) */
  @IsEnum(Direction)
  direction: Direction;
} 