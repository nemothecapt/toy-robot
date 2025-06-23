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
import { RobotStateDto } from '../dto/robot-state.dto';
import { RobotResponseDto } from '../dto/robot-response.dto';

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
   * @param robotStateDto - Robot position and direction data
   * @returns Saved robot entity with ID and timestamp
   */
  @Post('move')
  @HttpCode(HttpStatus.OK)
  async saveRobotState(@Body(ValidationPipe) robotStateDto: RobotStateDto): Promise<RobotResponseDto> {
    const robot = await this.robotService.saveRobotState(robotStateDto);
    return RobotResponseDto.fromEntity(robot);
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
  async getCurrentRobot(): Promise<RobotResponseDto | {}> {
    const robot = await this.robotService.getCurrentRobot();
    if (!robot) {
      return {}; // Return empty object instead of null for consistent frontend handling
    }
    return RobotResponseDto.fromEntity(robot);
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
  async getRobotHistory(): Promise<RobotResponseDto[]> {
    const robots = await this.robotService.getRobotHistory();
    return robots.map(robot => RobotResponseDto.fromEntity(robot));
  }
} 