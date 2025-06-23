/**
 * Keyboard Controls Hook
 * 
 * Custom hook that handles keyboard events for robot control.
 * Provides arrow key navigation and spacebar for report.
 */

import { useEffect, useCallback } from 'react';
import { Robot } from '../types/robot.types';

interface UseKeyboardControlsProps {
  robot: Robot | null;
  onMove: () => void;
  onTurnLeft: () => void;
  onTurnRight: () => void;
  onReport: () => void;
}

/**
 * Custom hook for keyboard controls
 */
export const useKeyboardControls = ({
  robot,
  onMove,
  onTurnLeft,
  onTurnRight,
  onReport,
}: UseKeyboardControlsProps): void => {
  
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Only handle keyboard events if robot is placed
      if (!robot) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onMove();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onTurnLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onTurnRight();
          break;
        case ' ': // Spacebar
          event.preventDefault();
          onReport();
          break;
      }
    },
    [robot, onMove, onTurnLeft, onTurnRight, onReport]
  );

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}; 