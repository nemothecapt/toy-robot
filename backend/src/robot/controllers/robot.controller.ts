import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RobotService } from '../services/robot.service';
import { PlaceRobotDto } from '../dto/place-robot.dto';

/**
 * Robot Controller
 * 
 * Handles HTTP requests for robot operations in a frontend-driven architecture.
 * The frontend handles all robot logic (movement, validation), while this API
 * only persists robot states for history tracking.
 */
@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  /**
   * POST /robot/move
   * 
   * Saves a robot state to the database for history tracking.
   * Used by frontend after executing robot movements/turns.
   * 
   * @param placeRobotDto - Robot position and direction data
   * @returns Saved robot entity with ID and timestamp
   */
  @Post('move')
  @HttpCode(HttpStatus.OK)
  async saveRobotState(@Body(ValidationPipe) placeRobotDto: PlaceRobotDto) {
    return this.robotService.saveRobotState(placeRobotDto);
  }

  /**
   * GET /robot/current
   * 
   * Retrieves the most recent robot state from database.
   * Used by frontend to restore robot position after page refresh.
   * 
   * @returns Latest robot state or empty object {} if no robot exists
   */
  @Get('current')
  async getCurrentRobot() {
    const robot = await this.robotService.getCurrentRobot();
    if (!robot) {
      return {}; // Return empty object instead of null for consistent frontend handling
    }
    return robot;
  }

  /**
   * GET /robot/history
   * 
   * Retrieves complete robot movement history.
   * Returns all robot states ordered by ID (newest first).
   * 
   * @returns Array of robot states in chronological order
   */
  @Get('history')
  async getRobotHistory() {
    return this.robotService.getRobotHistory();
  }
} 