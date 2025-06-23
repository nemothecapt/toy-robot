import { IsOptional, IsNumber, Min, Max } from 'class-validator';

/**
 * Robot Query Data Transfer Object
 * 
 * Validates query parameters for robot-related GET endpoints.
 * Currently used for potential future filtering of robot history.
 */
export class RobotQueryDto {
  /** Optional limit for number of history records to return */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number;

  /** Optional offset for pagination of history records */
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
} 