/**
 * Robot API Service Tests
 * 
 * Unit tests for the RobotApiService class that handles HTTP requests to the backend.
 */

import { Robot } from '../types/robot.types';

// Use manual mock
jest.mock('axios');

// Import the mocked axios and get access to the mock instance
import axios from 'axios';
const mockedAxios = axios as any;

// Import service after mocking
import { RobotApiService } from './robotApi';

describe('RobotApiService', () => {
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;

  beforeEach(() => {
    // Get the mock instance
    const mockInstance = mockedAxios.mockAxiosInstance;
    mockGet = mockInstance.get;
    mockPost = mockInstance.post;

    // Clear all mocks
    jest.clearAllMocks();
    mockGet.mockClear();
    mockPost.mockClear();
  });

  describe('getCurrentRobot', () => {
    it('should return robot data when robot exists', async () => {
      const mockRobot: Robot = {
        id: 1,
        x: 2,
        y: 3,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockGet.mockResolvedValue({ data: mockRobot });

      const result = await RobotApiService.getCurrentRobot();

      expect(mockGet).toHaveBeenCalledWith('/robot/current');
      expect(result).toEqual(mockRobot);
    });

    it('should return null when no robot exists (empty response)', async () => {
      mockGet.mockResolvedValue({ data: {} });

      const result = await RobotApiService.getCurrentRobot();

      expect(mockGet).toHaveBeenCalledWith('/robot/current');
      expect(result).toBeNull();
    });

    it('should throw error when API request fails', async () => {
      const mockError = new Error('Network error');
      mockGet.mockRejectedValue(mockError);

      await expect(RobotApiService.getCurrentRobot()).rejects.toThrow('Failed to fetch current robot state');
      expect(mockGet).toHaveBeenCalledWith('/robot/current');
    });

    it('should handle axios timeout error', async () => {
      const timeoutError = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' };
      mockGet.mockRejectedValue(timeoutError);

      await expect(RobotApiService.getCurrentRobot()).rejects.toThrow('Failed to fetch current robot state');
    });
  });

  describe('saveRobotState', () => {
    it('should save robot state successfully', async () => {
      const inputRobot: Robot = {
        x: 1,
        y: 2,
        direction: 'EAST'
      };

      const savedRobot: Robot = {
        id: 1,
        x: 1,
        y: 2,
        direction: 'EAST',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockPost.mockResolvedValue({ data: savedRobot });

      const result = await RobotApiService.saveRobotState(inputRobot);

      expect(mockPost).toHaveBeenCalledWith('/robot/move', {
        x: 1,
        y: 2,
        direction: 'EAST'
      });
      expect(result).toEqual(savedRobot);
    });

    it('should save robot state with existing ID', async () => {
      const existingRobot: Robot = {
        id: 5,
        x: 3,
        y: 4,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      const updatedRobot: Robot = {
        id: 6,
        x: 3,
        y: 4,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:01:00.000Z'
      };

      mockPost.mockResolvedValue({ data: updatedRobot });

      const result = await RobotApiService.saveRobotState(existingRobot);

      expect(mockPost).toHaveBeenCalledWith('/robot/move', {
        x: 3,
        y: 4,
        direction: 'SOUTH'
      });
      expect(result).toEqual(updatedRobot);
    });

    it('should handle network error when saving robot state', async () => {
      const robot: Robot = {
        x: 0,
        y: 0,
        direction: 'NORTH'
      };

      const networkError = new Error('Network Error');
      mockPost.mockRejectedValue(networkError);

      await expect(RobotApiService.saveRobotState(robot)).rejects.toThrow('Failed to save robot state');
      expect(mockPost).toHaveBeenCalledWith('/robot/move', {
        x: 0,
        y: 0,
        direction: 'NORTH'
      });
    });

    it('should handle API error response with custom message', async () => {
      const robot: Robot = {
        x: -1,
        y: -1,
        direction: 'NORTH'
      };

      const apiError = {
        response: {
          data: {
            message: 'Invalid robot position'
          }
        }
      };

      mockPost.mockRejectedValue(apiError);

      await expect(RobotApiService.saveRobotState(robot)).rejects.toThrow('Invalid robot position');
    });

    it('should handle API error without custom message', async () => {
      const robot: Robot = {
        x: 1,
        y: 1,
        direction: 'WEST'
      };

      const apiError = {
        response: {
          status: 500,
          data: {}
        }
      };

      mockPost.mockRejectedValue(apiError);

      await expect(RobotApiService.saveRobotState(robot)).rejects.toThrow('Failed to save robot state');
    });
  });

  describe('getRobotHistory', () => {
    it('should return robot history array', async () => {
      const mockHistory: Robot[] = [
        {
          id: 3,
          x: 2,
          y: 3,
          direction: 'EAST',
          createdAt: '2023-01-01T00:02:00.000Z'
        },
        {
          id: 2,
          x: 1,
          y: 3,
          direction: 'EAST',
          createdAt: '2023-01-01T00:01:00.000Z'
        },
        {
          id: 1,
          x: 1,
          y: 2,
          direction: 'NORTH',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      mockGet.mockResolvedValue({ data: mockHistory });

      const result = await RobotApiService.getRobotHistory();

      expect(mockGet).toHaveBeenCalledWith('/robot/history');
      expect(result).toEqual(mockHistory);
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(3); // Newest first
    });

    it('should return empty array when no history exists', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const result = await RobotApiService.getRobotHistory();

      expect(mockGet).toHaveBeenCalledWith('/robot/history');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw error when history request fails', async () => {
      const mockError = new Error('Database connection failed');
      mockGet.mockRejectedValue(mockError);

      await expect(RobotApiService.getRobotHistory()).rejects.toThrow('Failed to fetch robot history');
      expect(mockGet).toHaveBeenCalledWith('/robot/history');
    });

    it('should handle server error response', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' }
        }
      };

      mockGet.mockRejectedValue(serverError);

      await expect(RobotApiService.getRobotHistory()).rejects.toThrow('Failed to fetch robot history');
    });
  });

  describe('Service configuration and behavior', () => {
    it('should handle malformed robot data in getCurrentRobot', async () => {
      const malformedData = {
        x: 'invalid',
        y: null,
        direction: 123
      };

      mockGet.mockResolvedValue({ data: malformedData });

      const result = await RobotApiService.getCurrentRobot();

      // Should still return the data as-is (validation happens elsewhere)
      expect(result).toEqual(malformedData);
    });

    it('should handle all direction types in saveRobotState', async () => {
      const directions: Array<'NORTH' | 'SOUTH' | 'EAST' | 'WEST'> = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
      
      for (const direction of directions) {
        const robot: Robot = { x: 0, y: 0, direction };
        const savedRobot: Robot = { 
          id: 1, 
          x: 0, 
          y: 0, 
          direction, 
          createdAt: '2023-01-01T00:00:00.000Z' 
        };

        mockPost.mockResolvedValue({ data: savedRobot });

        const result = await RobotApiService.saveRobotState(robot);

        expect(mockPost).toHaveBeenCalledWith('/robot/move', {
          x: 0,
          y: 0,
          direction
        });
        expect(result.direction).toBe(direction);
      }
    });

    it('should handle boundary coordinates', async () => {
      const boundaryPositions = [
        { x: 0, y: 0 },    // Bottom-left corner
        { x: 4, y: 4 },    // Top-right corner
        { x: 0, y: 4 },    // Top-left corner
        { x: 4, y: 0 }     // Bottom-right corner
      ];

      for (const position of boundaryPositions) {
        const robot: Robot = { ...position, direction: 'NORTH' };
        const savedRobot: Robot = { 
          id: 1, 
          ...position, 
          direction: 'NORTH',
          createdAt: '2023-01-01T00:00:00.000Z' 
        };

        mockPost.mockResolvedValue({ data: savedRobot });

        const result = await RobotApiService.saveRobotState(robot);

        expect(result.x).toBe(position.x);
        expect(result.y).toBe(position.y);
      }
    });

    it('should properly structure request payloads', async () => {
      const robot: Robot = {
        id: 999, // This should be ignored in the request payload
        x: 2,
        y: 3,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:00:00.000Z' // This should also be ignored
      };

      const savedRobot: Robot = {
        id: 1000, // New ID from server
        x: 2,
        y: 3,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:05:00.000Z' // New timestamp from server
      };

      mockPost.mockResolvedValue({ data: savedRobot });

      const result = await RobotApiService.saveRobotState(robot);

      // Should only send x, y, direction (not id or createdAt)
      expect(mockPost).toHaveBeenCalledWith('/robot/move', {
        x: 2,
        y: 3,
        direction: 'SOUTH'
      });
      
      // Should return the server response (with new id and timestamp)
      expect(result).toEqual(savedRobot);
      expect(result.id).toBe(1000);
      expect(result.createdAt).toBe('2023-01-01T00:05:00.000Z');
    });

    it('should handle empty object response correctly', async () => {
      // Test the specific logic for empty object detection
      mockGet.mockResolvedValue({ data: {} });
      const result1 = await RobotApiService.getCurrentRobot();
      expect(result1).toBeNull();

      // Test with object that has properties
      mockGet.mockResolvedValue({ data: { x: 0, y: 0, direction: 'NORTH' } });
      const result2 = await RobotApiService.getCurrentRobot();
      expect(result2).not.toBeNull();
      expect(result2).toEqual({ x: 0, y: 0, direction: 'NORTH' });
    });
  });
}); 