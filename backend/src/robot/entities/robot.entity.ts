import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * Direction Enum
 * 
 * Represents the four cardinal directions the robot can face.
 * Used for robot orientation on the 5x5 grid.
 */
export enum Direction {
  NORTH = 'NORTH', // Facing up (positive Y direction)
  SOUTH = 'SOUTH', // Facing down (negative Y direction)
  EAST = 'EAST',   // Facing right (positive X direction)
  WEST = 'WEST',   // Facing left (negative X direction)
}

/**
 * Robot Entity
 * 
 * Database model for storing robot states and movement history.
 * Each record represents a single robot state at a point in time.
 * 
 * Grid coordinates:
 * - X: 0-4 (left to right)
 * - Y: 0-4 (bottom to top)
 * - Origin (0,0) is at bottom-left corner
 */
@Entity()
export class Robot {
  /** Auto-generated unique identifier for ordering and tracking */
  @PrimaryGeneratedColumn()
  id: number;

  /** X coordinate on the 5x5 grid (0-4, left to right) */
  @Column()
  x: number;

  /** Y coordinate on the 5x5 grid (0-4, bottom to top) */
  @Column()
  y: number;

  /** Direction the robot is facing (NORTH, SOUTH, EAST, WEST) */
  @Column({
    type: 'varchar',
    enum: Direction,
  })
  direction: Direction;

  /** Timestamp when this robot state was created */
  @CreateDateColumn()
  createdAt: Date;
} 