/**
 * Grid Component
 * 
 * Renders the 5x5 grid where the robot can be placed and moved.
 * Handles grid cell rendering and robot placement via clicks.
 */

import React from 'react';
import { Robot } from '../types/robot.types';

interface GridProps {
  robot: Robot | null;
  onCellClick: (x: number, y: number) => void;
}

/**
 * Grid component for the robot simulator
 */
export const Grid: React.FC<GridProps> = ({ robot, onCellClick }) => {
  
  const renderGrid = () => {
    const grid = [];
    
    // Create grid from top to bottom (y=4 to y=0) for proper display
    for (let y = 4; y >= 0; y--) {
      const row = [];
      
      for (let x = 0; x <= 4; x++) {
        const isRobotHere = robot && robot.x === x && robot.y === y;
        
        row.push(
          <div
            key={`${x}-${y}`}
            className={`grid-cell ${isRobotHere ? 'robot-cell' : ''}`}
            onClick={() => onCellClick(x, y)}
            data-coords={`${x},${y}`}
          >
            {isRobotHere && (
              <img 
                src={`/images/robot-${robot.direction.toLowerCase()}.png`}
                alt={`Robot facing ${robot.direction}`}
                className="robot-image"
              />
            )}
          </div>
        );
      }
      
      grid.push(
        <div key={y} className="grid-row">
          {row}
        </div>
      );
    }
    
    return grid;
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {renderGrid()}
      </div>
    </div>
  );
};

export default Grid; 