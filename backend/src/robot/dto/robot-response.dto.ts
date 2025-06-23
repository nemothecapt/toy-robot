import { Direction } from '../entities/robot.entity';

/**
 * Robot Response Data Transfer Object
 * 
 * Standardizes the structure of robot data returned by API endpoints.
 * Ensures consistent response format across all robot-related endpoints.
 */
export class RobotResponseDto {
  /** Unique identifier for the robot state record */
  id: number;

  /** X coordinate (0-4, left to right on the grid) */
  x: number;

  /** Y coordinate (0-4, bottom to top on the grid) */
  y: number;

  /** Robot facing direction (NORTH, SOUTH, EAST, or WEST) */
  direction: Direction;

  /** Timestamp when this robot state was created */
  createdAt: Date;

  constructor(id: number, x: number, y: number, direction: Direction, createdAt: Date) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.createdAt = createdAt;
  }

  /**
   * Creates a RobotResponseDto from a Robot entity
   */
  static fromEntity(robot: any): RobotResponseDto {
    return new RobotResponseDto(
      robot.id,
      robot.x,
      robot.y,
      robot.direction,
      robot.createdAt
    );
  }
} 