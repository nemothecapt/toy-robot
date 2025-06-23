/**
 * Robot Controls Component
 * 
 * Renders control buttons (LEFT, MOVE, RIGHT, REPORT) and status displays.
 * Handles button interactions and displays report/error messages.
 */

import React from 'react';
import { Robot } from '../types/robot.types';

interface RobotControlsProps {
  robot: Robot | null;
  reportMessage: string;
  error: string;
  onMove: () => void;
  onTurnLeft: () => void;
  onTurnRight: () => void;
  onReport: () => void;
}

/**
 * Robot controls and status display component
 */
export const RobotControls: React.FC<RobotControlsProps> = ({
  robot,
  reportMessage,
  error,
  onMove,
  onTurnLeft,
  onTurnRight,
  onReport,
}) => {
  
  /**
   * Parses and formats the report message for display
   */
  const formatReportMessage = (message: string) => {
    const parts = message.split(',');
    if (parts.length === 3) {
      return (
        <div>
          <p>X: {parts[0]}</p>
          <p>Y: {parts[1]}</p>
          <p>Direction: {parts[2]}</p>
        </div>
      );
    }
    return <p>{message}</p>;
  };

  return (
    <div className="controls">
      {/* Command Buttons */}
      <div className="command-buttons">
        <div className="main-buttons">
          <button
            onClick={onTurnLeft}
            disabled={!robot}
            className="command-btn turn-btn"
          >
            Left
          </button>
          <button
            onClick={onMove}
            disabled={!robot}
            className="command-btn move-btn"
          >
            Move
          </button>
          <button
            onClick={onTurnRight}
            disabled={!robot}
            className="command-btn turn-btn"
          >
            Right
          </button>
        </div>
        <button
          onClick={onReport}
          disabled={!robot}
          className="command-btn report-btn"
        >
          Report
        </button>
      </div>

      {/* Report Message Display */}
      {reportMessage && (
        <div className="report-message">
          <h3>Report:</h3>
          {formatReportMessage(reportMessage)}
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default RobotControls; 