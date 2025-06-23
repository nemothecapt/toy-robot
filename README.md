# Toy Robot Simulator

A web-based toy robot simulator that allows users to place and control a robot on a 5x5 grid table. The robot can move freely on the table but cannot fall off the edges.

## Features

- **Interactive 5x5 Grid**: Click on any cell to place the robot
- **Movement Controls**: Move, turn left, turn right, and report position
- **Keyboard Support**: Control the robot using arrow keys and spacebar
- **Position Persistence**: Robot position is saved to database and restored on page refresh
- **Movement History**: Complete history of robot positions is maintained
- **Boundary Validation**: Robot cannot fall off the table
- **Real-time Updates**: UI updates immediately with robot movements

## Architecture

This application uses a **frontend-driven architecture** for optimal user experience:

- **Frontend**: Handles all robot logic (placement, movement, turning, validation)
- **Backend**: Only persists robot states for history tracking
- **Benefits**: Instant UI updates, better performance, offline-capable robot logic

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite for local storage
- **ORM**: TypeORM for database operations
- **API**: Simplified RESTful API for state persistence
- **Testing**: Jest unit tests

### Frontend (React)
- **Framework**: React with TypeScript
- **State Management**: React hooks (useState, useEffect)
- **Robot Logic**: All movement and validation handled in frontend
- **HTTP Client**: Axios for state persistence
- **Styling**: Custom CSS with responsive design
- **Testing**: React Testing Library with Jest

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
The backend will start on `http://localhost:3000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3001` (default port)

## Usage

### Basic Operations

1. **Place Robot**: Click on any cell in the grid to place the robot at that position. The robot always faces NORTH when first placed.

2. **Move Robot**: 
   - Click the "Move" button or press the up arrow key
   - Moves the robot one space forward in the direction it's currently facing
   - Invalid moves (that would cause the robot to fall) are ignored

3. **Turn Robot**:
   - Click "Left" or "Right" buttons, or use left/right arrow keys
   - Rotates the robot 90 degrees in the specified direction

4. **Report Position**:
   - Click "Report" button or press spacebar
   - Displays the robot's current X, Y coordinates and facing direction

### Grid Coordinate System
- The grid is 5x5 (positions 0-4 on both axes)
- Origin (0,0) is at the **bottom-left** corner (SOUTH WEST)
- X-axis increases from left to right
- Y-axis increases from bottom to top

### Keyboard Controls
- **↑ Arrow**: MOVE
- **← Arrow**: LEFT
- **→ Arrow**: RIGHT  
- **Spacebar**: REPORT

## API Endpoints

### POST /robot/move
Save robot state for history (used by frontend for all actions)
```json
{
  "x": 0,
  "y": 0,
  "direction": "NORTH"
}
```

### GET /robot/current
Get the current active robot (returns `{}` if no robot placed)

### GET /robot/history
Get the complete history of robot positions ordered by ID

## Example Test Cases

### Test Case 1
```
PLACE 0,0,NORTH
MOVE
REPORT
Expected Output: 0,1,NORTH
```

### Test Case 2
```
PLACE 0,0,NORTH
LEFT
REPORT
Expected Output: 0,0,WEST
```

### Test Case 3
```
PLACE 1,2,NORTH
MOVE
MOVE
RIGHT
MOVE
REPORT
Expected Output: 2,4,EAST
```

## Testing

This project has **comprehensive test coverage** with a modular test structure that mirrors the component architecture.

### Test Coverage Summary
- **Total Tests**: 85 tests across 7 test suites
- **Test Coverage**: All major components, hooks, and services
- **Test Types**: Unit tests, integration tests, and component tests
- **Testing Framework**: Jest with React Testing Library

### Frontend Tests (85 tests)
```bash
cd frontend
npm test
```

#### Test Structure
The frontend follows a **modular testing approach** with individual test files for each component:

1. **`src/services/robotApi.test.ts`** (18 tests) ✅
   - API service layer testing
   - HTTP request/response handling
   - Error scenarios and edge cases
   - Network failure simulation

2. **`src/hooks/useRobotLogic.test.ts`** (17 tests) ✅
   - Robot state management and business logic
   - Placement, movement, turning, and reporting
   - Boundary validation and error handling
   - Async operations with proper mocking

3. **`src/hooks/useKeyboardControls.test.ts`** (8 tests) ✅
   - Keyboard event handling and mappings
   - Arrow keys and spacebar functionality
   - Event cleanup and disabled states

4. **`src/components/RobotControls.test.tsx`** (22 tests) ✅
   - Control buttons and status displays
   - Button states (enabled/disabled)
   - Report and error message formatting
   - CSS classes and accessibility

5. **`src/components/Grid.test.tsx`** (14 tests) ✅
   - 5x5 grid rendering and coordinate system
   - Robot positioning and direction images
   - Cell click handling and interactions
   - CSS styling and responsive behavior

6. **`src/components/RobotGrid.test.tsx`** (9 tests) ✅
   - Integration testing for main orchestrator
   - Full user workflows and interactions
   - API integration and error handling
   - Complete robot movement sequences

7. **`src/App.test.tsx`** (1 test) ✅
   - Application rendering verification

#### Test Features
- **Comprehensive Mocking**: Proper axios mocking for API tests
- **Async Testing**: Proper handling of async operations with `waitFor` and `act`
- **Error Scenarios**: Network errors, validation errors, and edge cases
- **Integration Tests**: Full user workflows from UI to API
- **Accessibility**: ARIA labels and keyboard navigation testing
- **Performance**: Boundary testing and large data sets

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=robotApi.test.ts
```

### Backend Tests
```bash
cd backend
npm run test        # Unit tests (6 tests)
npm run test:e2e    # API integration tests (5 tests)
```

**Backend Test Coverage:**
- ✅ **Service Layer Testing**: Robot state persistence and retrieval
- ✅ **DTO Validation**: Request/response data transfer objects
- ✅ **API Integration**: Full HTTP endpoint testing with validation
- ✅ **Database Operations**: SQLite repository operations
- ✅ **Error Handling**: Validation errors and edge cases

### Test Quality Standards
- **Isolated Tests**: Each test is independent and can run in isolation
- **Descriptive Names**: Clear test descriptions that explain expected behavior
- **Proper Setup/Teardown**: Consistent beforeEach/afterEach patterns
- **Mock Management**: Proper mock cleanup and state reset
- **Edge Case Coverage**: Boundary conditions and error scenarios
- **Integration Coverage**: Real user workflows and API interactions

## Design Decisions and Assumptions

### Assumptions Made
1. **Single Robot**: Only one robot can be active on the table at a time. Placing a new robot deactivates the previous one.
2. **Default Direction**: When clicking to place a robot, it always faces NORTH initially.
3. **Error Handling**: Invalid commands are ignored rather than throwing errors to the user.
4. **Persistence**: The robot's position persists across browser sessions using the database.

### Technical Decisions
1. **SQLite Database**: Chosen for simplicity and local development. Can be easily replaced with PostgreSQL/MySQL for production.
2. **TypeORM**: Provides good TypeScript integration and handles migrations automatically.
3. **React Hooks**: Used for state management instead of Redux for simplicity.
4. **Responsive Design**: CSS is mobile-friendly with breakpoints for smaller screens.

## Future Enhancements

If more time was available, the following features would be implemented:

### Additional Tests
- ✅ **COMPLETED**: Comprehensive unit and integration tests (85 tests)
- ✅ **COMPLETED**: API service layer testing with proper mocking
- ✅ **COMPLETED**: Accessibility testing for ARIA labels and keyboard navigation
- E2E tests using Cypress or Playwright
- Performance tests for database operations
- Visual regression testing

### Features
- Multiple robots support
- Animation for robot movements
- Sound effects
- Drag and drop robot placement
- Export/import robot sequences
- Real-time collaboration

### Technical Improvements
- Docker containerization
- CI/CD pipeline
- Error monitoring (Sentry)
- API rate limiting
- Database connection pooling
- Caching for better performance

## Project Structure

```
toy-robot-simulator/
├── backend/
│   ├── src/
│   │   ├── robot/
│   │   │   ├── controllers/robot.controller.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts                    # DTO exports
│   │   │   │   ├── robot-state.dto.ts          # Request validation
│   │   │   │   ├── robot-response.dto.ts       # Response standardization
│   │   │   │   └── robot-query.dto.ts          # Query parameter validation
│   │   │   ├── entities/robot.entity.ts
│   │   │   ├── services/robot.service.ts
│   │   │   └── robot.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/ (e2e tests)
│   └── toy-robot.db
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Grid.tsx & Grid.test.tsx
│   │   │   ├── RobotControls.tsx & RobotControls.test.tsx
│   │   │   └── RobotGrid.tsx & RobotGrid.test.tsx
│   │   ├── hooks/
│   │   │   ├── useRobotLogic.ts & useRobotLogic.test.ts
│   │   │   └── useKeyboardControls.ts & useKeyboardControls.test.ts
│   │   ├── services/
│   │   │   ├── robotApi.ts & robotApi.test.ts
│   │   │   └── __mocks__/axios.ts
│   │   ├── types/robot.types.ts
│   │   ├── App.tsx & App.test.tsx
│   │   └── index.tsx
│   └── public/ (static assets)
└── README.md
```

