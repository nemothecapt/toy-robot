/**
 * Robot API Service
 * 
 * Handles all HTTP requests to the robot backend API.
 * Centralizes API calls for better maintainability and error handling.
 */

import axios from 'axios';
import { Robot, RobotApiResponse } from '../types/robot.types';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Robot API Service Class
 */
export class RobotApiService {
  /**
   * Fetches the current robot state from the backend
   * @returns Promise<Robot | null> - Current robot state or null if no robot exists
   */
  static async getCurrentRobot(): Promise<Robot | null> {
    try {
      const response = await api.get<RobotApiResponse>('/robot/current');
      
      // Check if response is empty object {} (no robot) or has robot data
      if (Object.keys(response.data).length === 0) {
        return null;
      }
      
      return response.data as Robot;
    } catch (error) {
      console.error('Error fetching current robot:', error);
      throw new Error('Failed to fetch current robot state');
    }
  }

  /**
   * Saves a robot state to the backend for history tracking
   * @param robot - Robot state to save
   * @returns Promise<Robot> - Saved robot state with ID and timestamp
   */
  static async saveRobotState(robot: Robot): Promise<Robot> {
    try {
      const response = await api.post<Robot>('/robot/move', {
        x: robot.x,
        y: robot.y,
        direction: robot.direction,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error saving robot state:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save robot state';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetches complete robot movement history
   * @returns Promise<Robot[]> - Array of robot states ordered by ID (newest first)
   */
  static async getRobotHistory(): Promise<Robot[]> {
    try {
      const response = await api.get<Robot[]>('/robot/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching robot history:', error);
      throw new Error('Failed to fetch robot history');
    }
  }
}

// Export default instance for convenience
export default RobotApiService; 