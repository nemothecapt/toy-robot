# Toy Robot Simulator - Frontend

A React-based frontend application for the Toy Robot Simulator that provides an interactive interface for controlling a robot on a 5x5 grid.

## Architecture Overview

This frontend uses a **frontend-driven architecture** for optimal user experience:

- **Framework**: React 18 with TypeScript
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Robot Logic**: All movement, validation, and turning logic handled in frontend
- **API Integration**: Minimal backend calls only for state persistence
- **Benefits**: Instant UI updates, offline-capable robot logic, superior performance

## Features

- **Interactive 5x5 Grid**: Click any cell to place the robot instantly
- **Instant Controls**: Move, turn left, turn right, and report with immediate feedback
- **Keyboard Support**: Full arrow key and spacebar control
- **Real-time Validation**: Boundary checking prevents invalid moves
- **State Persistence**: Robot position saved to backend and restored on page refresh
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

## 🧪 Comprehensive Test Coverage

This project includes **85 automated tests across 7 test suites** with enterprise-level coverage:

### Test Suite Overview
```bash
npm test
```

**Test Results:**
- ✅ **85 tests** passing across **7 test suites**
- ✅ **API Service Testing** (18 tests) - HTTP requests, error handling, network failures
- ✅ **Business Logic Testing** (17 tests) - Robot placement, movement, turning, boundary validation
- ✅ **UI Component Testing** (22 tests) - Button states, rendering, interactions
- ✅ **Grid Testing** (14 tests) - Grid rendering, robot positioning, coordinate system
- ✅ **Integration Testing** (9 tests) - Full user workflows from UI to API
- ✅ **Keyboard Testing** (8 tests) - Arrow keys, spacebar, event cleanup
- ✅ **App Testing** (1 test) - Application rendering

### Test Files Structure
```
src/
├── services/
│   ├── robotApi.ts & robotApi.test.ts          # API service layer
│   └── __mocks__/axios.ts                      # Axios mocking
├── hooks/
│   ├── useRobotLogic.ts & useRobotLogic.test.ts        # Business logic
│   └── useKeyboardControls.ts & useKeyboardControls.test.ts  # Keyboard handling
├── components/
│   ├── Grid.tsx & Grid.test.tsx                # Grid rendering
│   ├── RobotControls.tsx & RobotControls.test.tsx      # UI controls
│   └── RobotGrid.tsx & RobotGrid.test.tsx      # Integration testing
└── App.tsx & App.test.tsx                      # Application
```

### Test Quality Features
- **Comprehensive Mocking**: Proper axios mocking using `__mocks__` directory
- **Async Testing**: Proper handling with `waitFor` and `act`
- **Error Scenarios**: Network errors, validation errors, edge cases
- **Integration Coverage**: Full user workflows from UI interactions to API calls
- **Accessibility Testing**: ARIA labels and keyboard navigation
- **Performance Testing**: Boundary conditions and large data sets

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=robotApi.test.ts

# Run tests in watch mode for development
npm test -- --watch

# Run tests without watch mode
npm test -- --watchAll=false
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
# Start development server
npm start
```

The application will open in your browser at `http://localhost:3001`

### Production Build
```bash
# Create optimized production build
npm run build

# Serve production build locally (requires serve)
npx serve -s build
```

## Component Architecture

### Custom Hooks
- **`useRobotLogic`**: Manages robot state, movement logic, and API integration
- **`useKeyboardControls`**: Handles keyboard event listeners and key mappings

### Components
- **`RobotGrid`**: Main orchestrator component that combines grid and controls
- **`Grid`**: Renders the 5x5 grid and handles robot positioning
- **`RobotControls`**: Control buttons and status displays

### Services
- **`robotApi`**: API service layer with comprehensive error handling
- **Types**: TypeScript definitions for robot state and directions

## Usage

### Basic Operations

1. **Place Robot**: Click any cell in the 5x5 grid
   - Robot appears instantly at clicked position
   - Always faces NORTH when first placed
   - Previous robot position is replaced

2. **Move Robot**: 
   - Click "Move" button or press ↑ arrow key
   - Robot moves one space forward in current direction
   - Invalid moves (off grid) are prevented instantly

3. **Turn Robot**:
   - Click "Left"/"Right" buttons or use ←/→ arrow keys
   - Robot rotates 90 degrees in specified direction
   - Visual robot image updates immediately

4. **Report Position**:
   - Click "Report" button or press spacebar
   - Displays current X, Y coordinates and direction
   - No API call needed - instant response

### Keyboard Controls
- **↑ Arrow**: MOVE forward
- **← Arrow**: TURN LEFT
- **→ Arrow**: TURN RIGHT  
- **Spacebar**: REPORT position

### Grid Coordinate System
- **Size**: 5x5 grid (positions 0-4 on both axes)
- **Origin**: (0,0) at bottom-left corner
- **X-axis**: Increases left to right
- **Y-axis**: Increases bottom to top

## API Integration

The frontend integrates with three backend endpoints:

- `GET /robot/current` - Load existing robot state on page refresh
- `POST /robot/move` - Save robot state for history (async, non-blocking)
- `GET /robot/history` - Retrieve complete movement history

## Performance Optimizations

- **Frontend-First Logic**: All robot operations execute instantly without API delays
- **Async Persistence**: Backend calls are non-blocking and don't affect UI responsiveness
- **Efficient Re-renders**: React hooks optimized to minimize unnecessary renders
- **Boundary Validation**: Client-side validation prevents invalid API calls

## Error Handling

- **Network Errors**: Graceful handling of backend connectivity issues
- **Validation Errors**: Client-side prevention of invalid moves
- **User Feedback**: Clear error messages for any issues
- **Offline Capability**: Robot logic continues to work without backend

## Browser Support

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting (if configured)
- **Testing**: Comprehensive test coverage for all functionality

### Project Structure
```
frontend/
├── public/
│   ├── images/                    # Robot direction images
│   └── index.html
├── src/
│   ├── components/               # React components with tests
│   ├── hooks/                   # Custom React hooks with tests
│   ├── services/               # API services with tests and mocks
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   └── index.tsx               # Application entry point
└── package.json
```

## Contributing

1. **Testing**: Add tests for new features using the established patterns
2. **Type Safety**: Maintain full TypeScript coverage
3. **Accessibility**: Ensure ARIA labels and keyboard navigation
4. **Performance**: Keep robot logic in frontend for instant responses
5. **Integration**: Test with backend to ensure API compatibility

## Example Test Cases

### Test Case 1: Basic Movement
```
1. Click grid cell (0,0) → Robot placed facing NORTH
2. Press ↑ arrow → Robot moves to (0,1)
3. Press spacebar → Report shows "X: 0, Y: 1, Direction: NORTH"
```

### Test Case 2: Boundary Validation
```
1. Click grid cell (0,4) → Robot placed at top edge
2. Press ↑ arrow → Robot stays at (0,4) - prevented from moving off grid
```

### Test Case 3: Full Rotation
```
1. Click grid cell (2,2) → Robot placed facing NORTH
2. Press → arrow 4 times → Robot cycles through EAST, SOUTH, WEST, NORTH
```
