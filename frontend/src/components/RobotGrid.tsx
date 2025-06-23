/**
 * Robot Grid Component
 * 
 * Main component for the robot simulator interface.
 * Orchestrates the grid, controls, and robot logic using smaller focused components.
 */

import React from 'react';
import { useRobotLogic } from '../hooks/useRobotLogic';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { Grid } from './Grid';
import { RobotControls } from './RobotControls';
import './RobotGrid.css';

/**
 * Main Robot Grid component
 */
const RobotGrid: React.FC = () => {
  // Use custom hooks for robot logic and keyboard controls
  const {
    robot,
    error,
    reportMessage,
    placeRobot,
    moveRobot,
    turnLeft,
    turnRight,
    generateReport,
  } = useRobotLogic();

  // Set up keyboard controls
  useKeyboardControls({
    robot,
    onMove: moveRobot,
    onTurnLeft: turnLeft,
    onTurnRight: turnRight,
    onReport: generateReport,
  });

  return (
    <div className="robot-simulator">
      <h1>Click to place the robot, use the buttons or arrows to move</h1>
      
      {/* Grid for robot placement and display */}
      <Grid 
        robot={robot} 
        onCellClick={placeRobot} 
      />

      {/* Control buttons and status displays */}
      <RobotControls
        robot={robot}
        reportMessage={reportMessage}
        error={error}
        onMove={moveRobot}
        onTurnLeft={turnLeft}
        onTurnRight={turnRight}
        onReport={generateReport}
      />
    </div>
  );
};

export default RobotGrid; 