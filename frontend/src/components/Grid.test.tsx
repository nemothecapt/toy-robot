/**
 * Grid Component Tests
 * 
 * Tests for the Grid component that renders the 5x5 game board.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Grid } from './Grid';
import { Robot } from '../types/robot.types';

describe('Grid', () => {
  const mockOnCellClick = jest.fn();
  
  const mockRobot: Robot = {
    id: 1,
    x: 2,
    y: 3,
    direction: 'NORTH',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    mockOnCellClick.mockClear();
  });

  it('should render a 5x5 grid', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    // Should have 25 cells (5x5)
    const cells = document.querySelectorAll('.grid-cell');
    expect(cells).toHaveLength(25);
  });

  it('should render grid cells with correct coordinates', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    // Check that grid container exists
    const gridContainer = document.querySelector('.grid-container');
    expect(gridContainer).toBeInTheDocument();
    
    // Check that specific coordinate cells exist
    const cell00 = document.querySelector('[data-coords="0,0"]');
    const cell44 = document.querySelector('[data-coords="4,4"]');
    const cell23 = document.querySelector('[data-coords="2,3"]');
    
    expect(cell00).toBeInTheDocument();
    expect(cell44).toBeInTheDocument();
    expect(cell23).toBeInTheDocument();
  });

  it('should display robot at correct position when robot exists', () => {
    render(<Grid robot={mockRobot} onCellClick={mockOnCellClick} />);
    
    const robotImage = screen.getByAltText('Robot facing NORTH');
    expect(robotImage).toBeInTheDocument();
    
    // Check that robot is in the correct cell
    const robotCell = document.querySelector('[data-coords="2,3"]');
    expect(robotCell).toContainElement(robotImage);
  });

  it('should use correct robot image based on direction', () => {
    const directions = [
      { direction: 'NORTH' as const, expectedSrc: '/images/robot-north.png' },
      { direction: 'EAST' as const, expectedSrc: '/images/robot-east.png' },
      { direction: 'SOUTH' as const, expectedSrc: '/images/robot-south.png' },
      { direction: 'WEST' as const, expectedSrc: '/images/robot-west.png' },
    ];

    directions.forEach(({ direction, expectedSrc }) => {
      const robot = { ...mockRobot, direction };
      const { unmount } = render(<Grid robot={robot} onCellClick={mockOnCellClick} />);
      
      const robotImage = screen.getByAltText(`Robot facing ${direction}`);
      expect(robotImage).toHaveAttribute('src', expectedSrc);
      
      unmount();
    });
  });

  it('should not display robot when robot is null', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    const robotImages = screen.queryAllByRole('img');
    expect(robotImages).toHaveLength(0);
  });

  it('should call onCellClick when a cell is clicked', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    // Click on cell at coordinates 1,2
    const cell = document.querySelector('[data-coords="1,2"]');
    fireEvent.click(cell!);
    
    expect(mockOnCellClick).toHaveBeenCalledWith(1, 2);
  });

  it('should call onCellClick with correct coordinates for different cells', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    // Test corner cells
    const cell00 = document.querySelector('[data-coords="0,0"]');
    fireEvent.click(cell00!);
    expect(mockOnCellClick).toHaveBeenCalledWith(0, 0);
    
    const cell44 = document.querySelector('[data-coords="4,4"]');
    fireEvent.click(cell44!);
    expect(mockOnCellClick).toHaveBeenCalledWith(4, 4);
    
    // Test center cell
    const cell22 = document.querySelector('[data-coords="2,2"]');
    fireEvent.click(cell22!);
    expect(mockOnCellClick).toHaveBeenCalledWith(2, 2);
  });

  it('should allow clicking on cell even when robot is present', () => {
    render(<Grid robot={mockRobot} onCellClick={mockOnCellClick} />);
    
    // Click on the cell where robot is located
    const robotCell = document.querySelector('[data-coords="2,3"]');
    fireEvent.click(robotCell!);
    
    expect(mockOnCellClick).toHaveBeenCalledWith(2, 3);
  });

  it('should have proper CSS classes for styling', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    const gridContainer = document.querySelector('.grid-container');
    expect(gridContainer).toHaveClass('grid-container');
    
    const cell = document.querySelector('[data-coords="0,0"]');
    expect(cell).toHaveClass('grid-cell');
  });

  it('should render cells in correct order (bottom-left is 0,0)', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    // The grid should render with Y=4 at the top and Y=0 at the bottom
    // This tests the coordinate system where (0,0) is bottom-left
    const allCells = document.querySelectorAll('.grid-cell');
    
    // First cell should be (0,4) - top-left visually, but (0,4) in coordinates
    const firstCell = allCells[0];
    expect(firstCell).toHaveAttribute('data-coords', '0,4');
    
    // Last cell should be (4,0) - bottom-right visually
    const lastCell = allCells[24];
    expect(lastCell).toHaveAttribute('data-coords', '4,0');
  });

  it('should maintain robot image size', () => {
    render(<Grid robot={mockRobot} onCellClick={mockOnCellClick} />);
    
    const robotImage = screen.getByAltText('Robot facing NORTH');
    expect(robotImage).toHaveClass('robot-image');
  });

  it('should add robot-cell class when robot is present', () => {
    render(<Grid robot={mockRobot} onCellClick={mockOnCellClick} />);
    
    const robotCell = document.querySelector('[data-coords="2,3"]');
    expect(robotCell).toHaveClass('robot-cell');
  });

  it('should render grid rows correctly', () => {
    render(<Grid robot={null} onCellClick={mockOnCellClick} />);
    
    const gridRows = document.querySelectorAll('.grid-row');
    expect(gridRows).toHaveLength(5);
    
    // Each row should have 5 cells
    gridRows.forEach(row => {
      const cellsInRow = row.querySelectorAll('.grid-cell');
      expect(cellsInRow).toHaveLength(5);
    });
  });
}); 