/**
 * Keyboard Controls Hook Tests
 * 
 * Tests for the useKeyboardControls custom hook that handles keyboard events.
 */

import { renderHook } from '@testing-library/react';
import { useKeyboardControls } from './useKeyboardControls';
import { Robot } from '../types/robot.types';

describe('useKeyboardControls', () => {
  const mockCallbacks = {
    onMove: jest.fn(),
    onTurnLeft: jest.fn(),
    onTurnRight: jest.fn(),
    onReport: jest.fn(),
  };

  const mockRobot: Robot = {
    id: 1,
    x: 2,
    y: 2,
    direction: 'NORTH',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  it('should call onMove when ArrowUp is pressed and robot exists', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onMove).toHaveBeenCalledTimes(1);
  });

  it('should call onTurnLeft when ArrowLeft is pressed and robot exists', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onTurnLeft).toHaveBeenCalledTimes(1);
  });

  it('should call onTurnRight when ArrowRight is pressed and robot exists', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onTurnRight).toHaveBeenCalledTimes(1);
  });

  it('should call onReport when Spacebar is pressed and robot exists', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const event = new KeyboardEvent('keydown', { key: ' ' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onReport).toHaveBeenCalledTimes(1);
  });

  it('should not call any callbacks when robot is null', () => {
    renderHook(() => useKeyboardControls({
      robot: null,
      ...mockCallbacks
    }));

    // Test all keys
    const keys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '];
    keys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    expect(mockCallbacks.onTurnLeft).not.toHaveBeenCalled();
    expect(mockCallbacks.onTurnRight).not.toHaveBeenCalled();
    expect(mockCallbacks.onReport).not.toHaveBeenCalled();
  });

  it('should not call callbacks for unrecognized keys', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    // Test random keys
    const randomKeys = ['a', 'Enter', 'Escape', 'Tab'];
    randomKeys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    expect(mockCallbacks.onTurnLeft).not.toHaveBeenCalled();
    expect(mockCallbacks.onTurnRight).not.toHaveBeenCalled();
    expect(mockCallbacks.onReport).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('should handle robot state changes correctly', () => {
    // Test with robot first
    const { unmount: unmount1 } = renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const event1 = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event1);
    expect(mockCallbacks.onMove).toHaveBeenCalledTimes(1);

    unmount1();
    jest.clearAllMocks();

    // Test without robot
    renderHook(() => useKeyboardControls({
      robot: null,
      ...mockCallbacks
    }));

    const event2 = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(event2);
    expect(mockCallbacks.onMove).not.toHaveBeenCalled();
  });

  it('should prevent default behavior for handled keys', () => {
    renderHook(() => useKeyboardControls({
      robot: mockRobot,
      ...mockCallbacks
    }));

    const handledKeys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '];
    
    handledKeys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
}); 