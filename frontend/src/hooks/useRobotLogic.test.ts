/**
 * Robot Logic Hook Tests
 * 
 * Tests for the useRobotLogic custom hook that manages robot state and business logic.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useRobotLogic } from './useRobotLogic';
import { RobotApiService } from '../services/robotApi';
import { Robot } from '../types/robot.types';

// Mock the RobotApiService
jest.mock('../services/robotApi');
const mockedRobotApiService = RobotApiService as jest.Mocked<typeof RobotApiService>;

describe('useRobotLogic', () => {
  beforeEach(() => {
    mockedRobotApiService.getCurrentRobot.mockClear();
    mockedRobotApiService.saveRobotState.mockClear();
  });

  it('should initialize with no robot', async () => {
    mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

    const { result } = renderHook(() => useRobotLogic());

    await waitFor(() => {
      expect(result.current.robot).toBeNull();
      expect(result.current.error).toBe('');
      expect(result.current.reportMessage).toBe('');
    });
  });

  it('should load existing robot on mount', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 2,
      y: 3,
      direction: 'NORTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);

    const { result } = renderHook(() => useRobotLogic());

    await waitFor(() => {
      expect(result.current.robot).toEqual(mockRobot);
    });
  });

  describe('placeRobot', () => {
    it('should place robot at valid position', async () => {
      mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);
      const savedRobot: Robot = {
        id: 1,
        x: 2,
        y: 3,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };
      mockedRobotApiService.saveRobotState.mockResolvedValue(savedRobot);

      const { result } = renderHook(() => useRobotLogic());

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.robot).toBeNull();
      });

      await act(async () => {
        await result.current.placeRobot(2, 3);
      });

      expect(result.current.robot).toEqual({
        x: 2,
        y: 3,
        direction: 'NORTH'
      });
      expect(mockedRobotApiService.saveRobotState).toHaveBeenCalledWith({
        x: 2,
        y: 3,
        direction: 'NORTH'
      });
    });

    it('should reject invalid position', async () => {
      mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

      const { result } = renderHook(() => useRobotLogic());

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.robot).toBeNull();
      });

      await act(async () => {
        await result.current.placeRobot(5, 5); // Out of bounds
      });

      expect(result.current.robot).toBeNull();
      expect(result.current.error).toBe('Position is out of bounds');
      expect(mockedRobotApiService.saveRobotState).not.toHaveBeenCalled();
    });
  });

  describe('moveRobot', () => {
    it('should move robot to valid position', async () => {
      const initialRobot: Robot = {
        id: 1,
        x: 2,
        y: 2,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(initialRobot);
      mockedRobotApiService.saveRobotState.mockResolvedValue({
        ...initialRobot,
        y: 3
      });

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(initialRobot);
      });

      await act(async () => {
        await result.current.moveRobot();
      });

      expect(result.current.robot).toEqual({
        ...initialRobot,
        y: 3
      });
    });

    it('should not move robot to invalid position', async () => {
      const robotAtEdge: Robot = {
        id: 1,
        x: 2,
        y: 4,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robotAtEdge);

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robotAtEdge);
      });

      await act(async () => {
        await result.current.moveRobot();
      });

      // Robot should stay at same position
      expect(result.current.robot).toEqual(robotAtEdge);
      expect(mockedRobotApiService.saveRobotState).not.toHaveBeenCalled();
    });

    it('should not move when no robot is placed', async () => {
      mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

      const { result } = renderHook(() => useRobotLogic());

      await act(async () => {
        await result.current.moveRobot();
      });

      expect(result.current.robot).toBeNull();
      expect(mockedRobotApiService.saveRobotState).not.toHaveBeenCalled();
    });
  });

  describe('turnLeft', () => {
    it('should turn robot left correctly', async () => {
      const robot: Robot = {
        id: 1,
        x: 2,
        y: 2,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);
      mockedRobotApiService.saveRobotState.mockResolvedValue({
        ...robot,
        direction: 'WEST'
      });

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      await act(async () => {
        await result.current.turnLeft();
      });

      expect(result.current.robot?.direction).toBe('WEST');
    });

    it('should cycle through all directions when turning left', async () => {
      const robot: Robot = {
        id: 1,
        x: 2,
        y: 2,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);
      mockedRobotApiService.saveRobotState.mockImplementation((r) => Promise.resolve(r));

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      // NORTH -> WEST -> SOUTH -> EAST -> NORTH
      await act(async () => {
        await result.current.turnLeft();
      });
      expect(result.current.robot?.direction).toBe('WEST');

      await act(async () => {
        await result.current.turnLeft();
      });
      expect(result.current.robot?.direction).toBe('SOUTH');

      await act(async () => {
        await result.current.turnLeft();
      });
      expect(result.current.robot?.direction).toBe('EAST');

      await act(async () => {
        await result.current.turnLeft();
      });
      expect(result.current.robot?.direction).toBe('NORTH');
    });
  });

  describe('turnRight', () => {
    it('should turn robot right correctly', async () => {
      const robot: Robot = {
        id: 1,
        x: 2,
        y: 2,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);
      mockedRobotApiService.saveRobotState.mockResolvedValue({
        ...robot,
        direction: 'EAST'
      });

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      await act(async () => {
        await result.current.turnRight();
      });

      expect(result.current.robot?.direction).toBe('EAST');
    });

    it('should cycle through all directions when turning right', async () => {
      const robot: Robot = {
        id: 1,
        x: 2,
        y: 2,
        direction: 'NORTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);
      mockedRobotApiService.saveRobotState.mockImplementation((r) => Promise.resolve(r));

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      // NORTH -> EAST -> SOUTH -> WEST -> NORTH
      await act(async () => {
        await result.current.turnRight();
      });
      expect(result.current.robot?.direction).toBe('EAST');

      await act(async () => {
        await result.current.turnRight();
      });
      expect(result.current.robot?.direction).toBe('SOUTH');

      await act(async () => {
        await result.current.turnRight();
      });
      expect(result.current.robot?.direction).toBe('WEST');

      await act(async () => {
        await result.current.turnRight();
      });
      expect(result.current.robot?.direction).toBe('NORTH');
    });
  });

  describe('generateReport', () => {
    it('should generate report for placed robot', async () => {
      const robot: Robot = {
        id: 1,
        x: 3,
        y: 1,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      act(() => {
        result.current.generateReport();
      });

      expect(result.current.reportMessage).toBe('3,1,SOUTH');
    });

    it('should not generate report when no robot is placed', async () => {
      mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

      const { result } = renderHook(() => useRobotLogic());

      act(() => {
        result.current.generateReport();
      });

      expect(result.current.reportMessage).toBe('');
    });
  });

  describe('clearReport', () => {
    it('should clear the report message', async () => {
      const robot: Robot = {
        id: 1,
        x: 3,
        y: 1,
        direction: 'SOUTH',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      mockedRobotApiService.getCurrentRobot.mockResolvedValue(robot);

      const { result } = renderHook(() => useRobotLogic());

      await waitFor(() => {
        expect(result.current.robot).toEqual(robot);
      });

      act(() => {
        result.current.generateReport();
      });

      expect(result.current.reportMessage).toBe('3,1,SOUTH');

      act(() => {
        result.current.clearReport();
      });

      expect(result.current.reportMessage).toBe('');
    });
  });

  describe('clearError', () => {
    it('should clear the error message', async () => {
      mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

      const { result } = renderHook(() => useRobotLogic());

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.robot).toBeNull();
      });

      await act(async () => {
        await result.current.placeRobot(5, 5); // Invalid position
      });

      expect(result.current.error).toBe('Position is out of bounds');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe('');
    });
  });
}); 