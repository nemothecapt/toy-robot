/**
 * Robot Types and Interfaces
 * 
 * Shared type definitions for the robot simulator application.
 */

/** Robot state interface */
export interface Robot {
  id?: number;
  x: number;
  y: number;
  direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  createdAt?: string;
}

/** Available robot commands */
export enum Command {
  MOVE = 'MOVE',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  REPORT = 'REPORT',
}

/** Direction type for better type safety */
export type Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

/** Grid position interface */
export interface Position {
  x: number;
  y: number;
}

/** API response for robot current endpoint */
export interface RobotApiResponse {
  id?: number;
  x?: number;
  y?: number;
  direction?: Direction;
  createdAt?: string;
} 