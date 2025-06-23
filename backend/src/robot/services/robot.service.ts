import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from '../entities/robot.entity';
import { PlaceRobotDto } from '../dto/place-robot.dto';

/**
 * Robot Service
 * 
 * Handles database operations for robot state persistence.
 * In the frontend-driven architecture, this service only manages
 * data persistence - all robot logic is handled by the frontend.
 */
@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot)
    private robotRepository: Repository<Robot>,
  ) {}

  /**
   * Saves a robot state to the database
   * 
   * Creates a new robot record for history tracking.
   * Frontend validates moves before calling this method.
   * 
   * @param placeRobotDto - Robot position and direction data
   * @returns Promise<Robot> - Saved robot entity with generated ID and timestamp
   */
  async saveRobotState(placeRobotDto: PlaceRobotDto): Promise<Robot> {
    // Frontend handles validation, we just save the state for history
    const robot = this.robotRepository.create(placeRobotDto);
    return this.robotRepository.save(robot);
  }

  /**
   * Retrieves the most recent robot state
   * 
   * Uses ID-based ordering to get the latest robot state.
   * ID ordering is more reliable than timestamp-based ordering.
   * 
   * @returns Promise<Robot | null> - Latest robot state or null if none exists
   */
  async getCurrentRobot(): Promise<Robot | null> {
    return this.robotRepository
      .createQueryBuilder('robot')
      .orderBy('robot.id', 'DESC') // Order by ID for consistency
      .getOne();
  }

  /**
   * Retrieves complete robot movement history
   * 
   * Returns all robot states ordered by ID (newest first).
   * Each robot action (place, move, turn) creates a separate record.
   * 
   * @returns Promise<Robot[]> - Array of all robot states in chronological order
   */
  async getRobotHistory(): Promise<Robot[]> {
    return this.robotRepository.find({
      order: { id: 'DESC' }, // Newest first for consistent ordering
    });
  }
} 