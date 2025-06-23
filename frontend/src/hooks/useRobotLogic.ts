/**
 * Robot Logic Hook
 * 
 * Custom hook that manages robot state and business logic.
 * Handles placement, movement, turning, and validation.
 */

import { useState, useEffect, useRef } from 'react';
import { Robot, Direction, Position } from '../types/robot.types';
import { RobotApiService } from '../services/robotApi';

interface UseRobotLogicReturn {
  robot: Robot | null;
  error: string;
  reportMessage: string;
  placeRobot: (x: number, y: number) => Promise<void>;
  moveRobot: () => Promise<void>;
  turnLeft: () => Promise<void>;
  turnRight: () => Promise<void>;
  generateReport: () => void;
  clearReport: () => void;
  clearError: () => void;
}

/**
 * Custom hook for robot logic and state management
 */
export const useRobotLogic = (): UseRobotLogicReturn => {
  const [robot, setRobot] = useState<Robot | null>(null);
  const [reportMessage, setReportMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const hasFetchedRef = useRef(false);

  // Load robot state on mount
  useEffect(() => {
    const fetchCurrentRobot = async () => {
      if (hasFetchedRef.current) return; // Prevent double calls
      hasFetchedRef.current = true;
      
      try {
        const currentRobot = await RobotApiService.getCurrentRobot();
        setRobot(currentRobot);
        setError('');
      } catch (err) {
        console.error('Error fetching robot:', err);
        // Don't set error for initial load failure
      }
    };

    fetchCurrentRobot();
  }, []);

  /**
   * Validates if a position is within the 5x5 grid bounds
   */
  const isValidPosition = (x: number, y: number): boolean => {
    return x >= 0 && x <= 4 && y >= 0 && y <= 4;
  };

  /**
   * Calculates the next position based on current position and direction
   */
  const getNextPosition = (x: number, y: number, direction: Direction): Position => {
    switch (direction) {
      case 'NORTH':
        return { x, y: y + 1 };
      case 'SOUTH':
        return { x, y: y - 1 };
      case 'EAST':
        return { x: x + 1, y };
      case 'WEST':
        return { x: x - 1, y };
      default:
        return { x, y };
    }
  };

  /**
   * Saves robot state to backend asynchronously
   */
  const saveRobotState = async (robotState: Robot): Promise<void> => {
    try {
      await RobotApiService.saveRobotState(robotState);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error saving robot state');
    }
  };

  /**
   * Places robot at specified coordinates
   */
  const placeRobot = async (x: number, y: number): Promise<void> => {
    if (!isValidPosition(x, y)) {
      setError('Position is out of bounds');
      return;
    }

    const newRobot: Robot = {
      x,
      y,
      direction: 'NORTH', // Always start facing north
    };

    setRobot(newRobot);
    setReportMessage(''); // Clear any existing report
    await saveRobotState(newRobot);
  };

  /**
   * Moves robot one step forward in current direction
   */
  const moveRobot = async (): Promise<void> => {
    if (!robot) return;

    const nextPosition = getNextPosition(robot.x, robot.y, robot.direction);
    
    if (!isValidPosition(nextPosition.x, nextPosition.y)) {
      // Invalid move - robot stays in same position, no error shown
      return;
    }

    const newRobot: Robot = {
      ...robot,
      x: nextPosition.x,
      y: nextPosition.y,
    };

    setRobot(newRobot);
    setReportMessage(''); // Clear any existing report
    await saveRobotState(newRobot);
  };

  /**
   * Turns robot 90 degrees to the left (counter-clockwise)
   */
  const turnLeft = async (): Promise<void> => {
    if (!robot) return;

    const directionOrder: Direction[] = ['NORTH', 'WEST', 'SOUTH', 'EAST'];
    const currentIndex = directionOrder.indexOf(robot.direction);
    const newIndex = (currentIndex + 1) % 4;

    const newRobot: Robot = {
      ...robot,
      direction: directionOrder[newIndex],
    };

    setRobot(newRobot);
    setReportMessage(''); // Clear any existing report
    await saveRobotState(newRobot);
  };

  /**
   * Turns robot 90 degrees to the right (clockwise)
   */
  const turnRight = async (): Promise<void> => {
    if (!robot) return;

    const directionOrder: Direction[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directionOrder.indexOf(robot.direction);
    const newIndex = (currentIndex + 1) % 4;

    const newRobot: Robot = {
      ...robot,
      direction: directionOrder[newIndex],
    };

    setRobot(newRobot);
    setReportMessage(''); // Clear any existing report
    await saveRobotState(newRobot);
  };

  /**
   * Generates a report of current robot position and direction
   */
  const generateReport = (): void => {
    if (!robot) return;
    setReportMessage(`${robot.x},${robot.y},${robot.direction}`);
  };

  /**
   * Clears the current report message
   */
  const clearReport = (): void => {
    setReportMessage('');
  };

  /**
   * Clears the current error message
   */
  const clearError = (): void => {
    setError('');
  };

  return {
    robot,
    error,
    reportMessage,
    placeRobot,
    moveRobot,
    turnLeft,
    turnRight,
    generateReport,
    clearReport,
    clearError,
  };
}; 