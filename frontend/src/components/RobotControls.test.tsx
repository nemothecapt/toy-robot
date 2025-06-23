/**
 * Robot Controls Component Tests
 * 
 * Tests for the RobotControls component that renders control buttons and status displays.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RobotControls } from './RobotControls';
import { Robot } from '../types/robot.types';

describe('RobotControls', () => {
  const mockCallbacks = {
    onMove: jest.fn(),
    onTurnLeft: jest.fn(),
    onTurnRight: jest.fn(),
    onReport: jest.fn(),
  };

  const mockRobot: Robot = {
    id: 1,
    x: 2,
    y: 3,
    direction: 'NORTH',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    Object.values(mockCallbacks).forEach(fn => fn.mockClear());
  });

  describe('Button States', () => {
    it('should disable all buttons when no robot is placed', () => {
      render(
        <RobotControls
          robot={null}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Left')).toBeDisabled();
      expect(screen.getByText('Move')).toBeDisabled();
      expect(screen.getByText('Right')).toBeDisabled();
      expect(screen.getByText('Report')).toBeDisabled();
    });

    it('should enable all buttons when robot is placed', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Left')).toBeEnabled();
      expect(screen.getByText('Move')).toBeEnabled();
      expect(screen.getByText('Right')).toBeEnabled();
      expect(screen.getByText('Report')).toBeEnabled();
    });
  });

  describe('Button Clicks', () => {
    it('should call onTurnLeft when Left button is clicked', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      fireEvent.click(screen.getByText('Left'));
      expect(mockCallbacks.onTurnLeft).toHaveBeenCalledTimes(1);
    });

    it('should call onMove when Move button is clicked', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      fireEvent.click(screen.getByText('Move'));
      expect(mockCallbacks.onMove).toHaveBeenCalledTimes(1);
    });

    it('should call onTurnRight when Right button is clicked', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      fireEvent.click(screen.getByText('Right'));
      expect(mockCallbacks.onTurnRight).toHaveBeenCalledTimes(1);
    });

    it('should call onReport when Report button is clicked', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      fireEvent.click(screen.getByText('Report'));
      expect(mockCallbacks.onReport).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Layout', () => {
    it('should render buttons in correct order: Left - Move - Right', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const buttons = screen.getAllByRole('button');
      const mainButtons = buttons.slice(0, 3); // First 3 buttons

      expect(mainButtons[0]).toHaveTextContent('Left');
      expect(mainButtons[1]).toHaveTextContent('Move');
      expect(mainButtons[2]).toHaveTextContent('Right');
    });

    it('should render Report button separately below main buttons', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const reportButton = screen.getByText('Report');
      expect(reportButton).toBeInTheDocument();
      
      // Check that Report button has correct class
      expect(reportButton).toHaveClass('command-btn', 'report-btn');
    });
  });

  describe('Report Display', () => {
    it('should display report message when provided', () => {
      const reportMessage = '2,3,NORTH';
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage={reportMessage}
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Report:')).toBeInTheDocument();
      expect(screen.getByText('X: 2')).toBeInTheDocument();
      expect(screen.getByText('Y: 3')).toBeInTheDocument();
      expect(screen.getByText('Direction: NORTH')).toBeInTheDocument();
    });

    it('should not display report section when no message', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.queryByText('Report:')).not.toBeInTheDocument();
    });

    it('should display formatted report message', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage="2,3,NORTH"
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Report:')).toBeInTheDocument();
      expect(screen.getByText('X: 2')).toBeInTheDocument();
      expect(screen.getByText('Y: 3')).toBeInTheDocument();
      expect(screen.getByText('Direction: NORTH')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display error message when provided', () => {
      const errorMessage = 'Position is out of bounds';
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error={errorMessage}
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display error section when no error', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      expect(screen.queryByText('Error:')).not.toBeInTheDocument();
    });

    it('should display error message with proper structure', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error="Some error"
          {...mockCallbacks}
        />
      );

      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Some error')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes for main buttons', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const leftButton = screen.getByText('Left');
      const moveButton = screen.getByText('Move');
      const rightButton = screen.getByText('Right');

      expect(leftButton).toHaveClass('command-btn', 'turn-btn');
      expect(moveButton).toHaveClass('command-btn', 'move-btn');
      expect(rightButton).toHaveClass('command-btn', 'turn-btn');
    });

    it('should have correct CSS class for report button', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const reportButton = screen.getByText('Report');
      expect(reportButton).toHaveClass('command-btn', 'report-btn');
    });

    it('should have proper container classes', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const controlsContainer = document.querySelector('.controls');
      const mainButtonsContainer = document.querySelector('.main-buttons');
      
      expect(controlsContainer).toBeInTheDocument();
      expect(mainButtonsContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4); // Left, Move, Right, Report
    });

    it('should have proper ARIA labels for disabled buttons', () => {
      render(
        <RobotControls
          robot={null}
          reportMessage=""
          error=""
          {...mockCallbacks}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Multiple Status Display', () => {
    it('should display both report and error when both exist', () => {
      render(
        <RobotControls
          robot={mockRobot}
          reportMessage="2,3,NORTH"
          error="Some error occurred"
          {...mockCallbacks}
        />
      );

      // Check report display
      expect(screen.getByText('Report:')).toBeInTheDocument();
      expect(screen.getByText('X: 2')).toBeInTheDocument();
      expect(screen.getByText('Y: 3')).toBeInTheDocument();
      expect(screen.getByText('Direction: NORTH')).toBeInTheDocument();
      
      // Check error display
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Some error occurred')).toBeInTheDocument();
    });
  });
}); 