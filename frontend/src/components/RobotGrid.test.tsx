/**
 * Robot Grid Integration Tests
 * 
 * Integration tests for the main RobotGrid component that orchestrates all sub-components.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RobotGrid from './RobotGrid';
import { RobotApiService } from '../services/robotApi';
import { Robot } from '../types/robot.types';

// Mock the RobotApiService
jest.mock('../services/robotApi');
const mockedRobotApiService = RobotApiService as jest.Mocked<typeof RobotApiService>;

describe('RobotGrid Integration', () => {
  beforeEach(() => {
    mockedRobotApiService.getCurrentRobot.mockClear();
    mockedRobotApiService.saveRobotState.mockClear();
  });

  it('should render grid and controls together', async () => {
    mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);

    render(<RobotGrid />);

    // Should render the grid
    await waitFor(() => {
      expect(screen.getByText('Click to place the robot, use the buttons or arrows to move')).toBeInTheDocument();
    });

    // Should render the controls
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
    expect(screen.getByText('Report')).toBeInTheDocument();
    
    // Should have all buttons disabled initially
    expect(screen.getByText('Left')).toBeDisabled();
    expect(screen.getByText('Move')).toBeDisabled();
    expect(screen.getByText('Right')).toBeDisabled();
    expect(screen.getByText('Report')).toBeDisabled();
  });

  it('should load existing robot state on mount', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 2,
      y: 3,
      direction: 'EAST',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);

    render(<RobotGrid />);

    // Should load the robot and enable buttons
    await waitFor(() => {
      expect(screen.getByText('Left')).toBeEnabled();
      expect(screen.getByText('Move')).toBeEnabled();
      expect(screen.getByText('Right')).toBeEnabled();
      expect(screen.getByText('Report')).toBeEnabled();
    });

    // Should display robot in grid
    const robotImage = screen.getByAltText('Robot facing EAST');
    expect(robotImage).toBeInTheDocument();
    expect(robotImage).toHaveAttribute('src', '/images/robot-east.png');
  });

  it('should place robot when grid cell is clicked', async () => {
    mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);
    const savedRobot: Robot = {
      id: 1,
      x: 1,
      y: 2,
      direction: 'NORTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    mockedRobotApiService.saveRobotState.mockResolvedValue(savedRobot);

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Click to place the robot, use the buttons or arrows to move')).toBeInTheDocument();
    });

    // Click on a grid cell
    const cell = document.querySelector('[data-coords="1,2"]');
    fireEvent.click(cell!);

    // Should enable buttons after placing robot
    await waitFor(() => {
      expect(screen.getByText('Left')).toBeEnabled();
    });

    // Should save robot state
    expect(mockedRobotApiService.saveRobotState).toHaveBeenCalled();
  });

  it('should integrate keyboard controls with robot actions', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 2,
      y: 2,
      direction: 'NORTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);
    mockedRobotApiService.saveRobotState.mockImplementation((robot) => 
      Promise.resolve({ ...robot, id: 2, createdAt: '2023-01-01T00:01:00.000Z' })
    );

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Move')).toBeEnabled();
    });

    // Test keyboard controls
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    
    await waitFor(() => {
      expect(mockedRobotApiService.saveRobotState).toHaveBeenCalled();
    });
  });

  it('should display report when Report button is clicked', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 3,
      y: 1,
      direction: 'SOUTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Report')).toBeEnabled();
    });

    // Click Report button
    fireEvent.click(screen.getByText('Report'));

    // Should display report with proper format
    await waitFor(() => {
      expect(screen.getByText('Report:')).toBeInTheDocument();
      expect(screen.getByText('X: 3')).toBeInTheDocument();
      expect(screen.getByText('Y: 1')).toBeInTheDocument();
      expect(screen.getByText('Direction: SOUTH')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedRobotApiService.getCurrentRobot.mockRejectedValue(new Error('Network error'));

    render(<RobotGrid />);

    // Should still render the component even if API fails
    await waitFor(() => {
      expect(screen.getByText('Click to place the robot, use the buttons or arrows to move')).toBeInTheDocument();
    });

    // Buttons should remain disabled
    expect(screen.getByText('Left')).toBeDisabled();
    expect(screen.getByText('Move')).toBeDisabled();
    expect(screen.getByText('Right')).toBeDisabled();
    expect(screen.getByText('Report')).toBeDisabled();
  });

  it('should handle robot placement errors', async () => {
    mockedRobotApiService.getCurrentRobot.mockResolvedValue(null);
    mockedRobotApiService.saveRobotState.mockRejectedValue(new Error('Failed to save robot'));

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Click to place the robot, use the buttons or arrows to move')).toBeInTheDocument();
    });

    // Click on a grid cell
    const cell = document.querySelector('[data-coords="1,2"]');
    fireEvent.click(cell!);

    // Should display error message
    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Failed to save robot')).toBeInTheDocument();
    });
  });

  it('should validate robot movement boundaries', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 4,
      y: 4,
      direction: 'NORTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Move')).toBeEnabled();
    });

    // Try to move beyond boundary
    fireEvent.click(screen.getByText('Move'));

    // Should not make API call for invalid move
    await waitFor(() => {
      expect(mockedRobotApiService.saveRobotState).not.toHaveBeenCalled();
    });
  });

  it('should complete a full robot movement sequence', async () => {
    const mockRobot: Robot = {
      id: 1,
      x: 0,
      y: 0,
      direction: 'NORTH',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockedRobotApiService.getCurrentRobot.mockResolvedValue(mockRobot);
    mockedRobotApiService.saveRobotState.mockImplementation((robot) => 
      Promise.resolve({ ...robot, id: 2, createdAt: '2023-01-01T00:01:00.000Z' })
    );

    render(<RobotGrid />);

    await waitFor(() => {
      expect(screen.getByText('Move')).toBeEnabled();
    });

    // Move sequence: Move -> Turn Right -> Move -> Report
    fireEvent.click(screen.getByText('Move'));
    
    await waitFor(() => {
      expect(mockedRobotApiService.saveRobotState).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Right'));
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Report'));

    // Should display final report
    await waitFor(() => {
      expect(screen.getByText('Report:')).toBeInTheDocument();
    });
  });
}); 