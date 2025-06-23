# Test Instructions for Toy Robot Simulator

This document provides comprehensive test instructions to exercise all functionality of the Toy Robot Simulator application.

## 🧪 Automated Test Coverage

This project includes **comprehensive automated test coverage** with **85 tests across 7 test suites**:

### Frontend Test Suite (85 tests)
```bash
cd frontend
npm test
```

#### Test Files Overview:
1. **`robotApi.test.ts`** (18 tests) - API service layer testing
2. **`useRobotLogic.test.ts`** (17 tests) - Robot business logic and state management
3. **`RobotControls.test.tsx`** (22 tests) - Control buttons and UI interactions
4. **`Grid.test.tsx`** (14 tests) - Grid rendering and robot positioning
5. **`RobotGrid.test.tsx`** (9 tests) - Integration testing and full workflows
6. **`useKeyboardControls.test.ts`** (8 tests) - Keyboard event handling
7. **`App.test.tsx`** (1 test) - Application rendering

#### Test Coverage Includes:
- ✅ **API Service Testing**: HTTP requests, error handling, network failures
- ✅ **Business Logic Testing**: Robot placement, movement, turning, boundary validation
- ✅ **UI Component Testing**: Button states, rendering, interactions
- ✅ **Integration Testing**: Full user workflows from UI to API
- ✅ **Keyboard Testing**: Arrow keys, spacebar, event cleanup
- ✅ **Error Scenarios**: Network errors, validation errors, edge cases
- ✅ **Accessibility Testing**: ARIA labels, keyboard navigation
- ✅ **Async Operations**: Proper mocking and async/await handling

#### Running Automated Tests:
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=robotApi.test.ts

# Run tests in watch mode for development
npm test -- --watch
```

**Note**: The automated tests provide comprehensive coverage of all functionality described in the manual testing scenarios below. Run the automated tests first to verify core functionality before proceeding with manual testing.

## Architecture Overview

The application now uses a **frontend-driven architecture**:
- **Frontend**: Handles all robot logic (placement, movement, turning, validation)
- **Backend**: Only persists robot states for history tracking
- **Benefits**: Instant UI updates, better performance, offline-capable robot logic

## Setup Instructions

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   Verify: Backend should be running on `http://localhost:3000`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Verify: Frontend should open in browser at `http://localhost:3001` (default port)

## API Endpoints

The backend now has a simplified API:
- `GET /robot/current` - Returns latest robot state or `{}` if no robot
- `POST /robot/move` - Saves robot state for history
- `GET /robot/history` - Returns complete robot history ordered by ID

## Manual Testing Scenarios

### Test Group 1: Basic Robot Placement

#### Test 1.1: Initial State
- **Action**: Open the application
- **Expected**: Empty 5x5 grid with no robot visible
- **Expected**: All command buttons (LEFT, MOVE, RIGHT, REPORT) should be disabled
- **Expected**: Grid cells should be clickable for robot placement

#### Test 1.2: Place Robot - Valid Position
- **Action**: Click on cell at position (2,2) - middle of grid
- **Expected**: Robot image appears instantly at clicked position
- **Expected**: Robot faces North direction (upward-pointing image)
- **Expected**: All command buttons become enabled immediately
- **Expected**: Backend saves robot state (check network tab)

#### Test 1.3: Place Robot - Boundary Positions
- **Action**: Click on corner positions (0,0), (0,4), (4,0), (4,4)
- **Expected**: Robot successfully places at each corner instantly
- **Expected**: Robot always faces North on initial placement

#### Test 1.4: Replace Robot
- **Action**: Place robot at (1,1), then click on (3,3)
- **Expected**: Robot disappears from (1,1) and appears at (3,3) instantly
- **Expected**: Only one robot visible at any time
- **Expected**: Both placements saved to backend history

### Test Group 2: Movement Commands (Frontend Logic)

#### Test 2.1: MOVE Command - Valid Movement
- **Setup**: Place robot at (2,2) facing NORTH
- **Action**: Click MOVE button or press Up arrow
- **Expected**: Robot moves instantly to (2,3)
- **Expected**: Robot image updates position immediately
- **Expected**: Backend saves new state asynchronously

#### Test 2.2: MOVE Command - Boundary Prevention
- **Setup**: Place robot at (2,4) facing NORTH (top edge)
- **Action**: Click MOVE button
- **Expected**: Robot stays at (2,4) - does not move off grid
- **Expected**: No visual glitch or error message
- **Expected**: No backend call made for invalid move

#### Test 2.3: MOVE Command - All Directions
- **Setup**: Place robot at (2,2)
- **Actions**:
  1. MOVE (should go North to 2,3)
  2. RIGHT, MOVE (should go East to 3,3)
  3. RIGHT, MOVE (should go South to 3,2)
  4. RIGHT, MOVE (should go West to 2,2)
- **Expected**: Robot follows the square path instantly
- **Expected**: Each move creates a new history record

#### Test 2.4: LEFT Turn Command
- **Setup**: Place robot at (2,2) facing NORTH
- **Action**: Click LEFT button or press Left arrow
- **Expected**: Robot stays at (2,2) but image changes to face WEST
- **Expected**: Turn happens instantly without delay

#### Test 2.5: RIGHT Turn Command
- **Setup**: Place robot at (2,2) facing NORTH
- **Action**: Click RIGHT button or press Right arrow
- **Expected**: Robot stays at (2,2) but image changes to face EAST
- **Expected**: Turn happens instantly without delay

#### Test 2.6: REPORT Command
- **Setup**: Place robot at (1,3) facing SOUTH
- **Action**: Click REPORT button or press Spacebar
- **Expected**: Report displays instantly: "X: 1, Y: 3, Direction: SOUTH"
- **Expected**: No backend call needed for report

### Test Group 3: Button Layout and Styling

#### Test 3.1: Button Arrangement
- **Verification**: Buttons arranged as LEFT - MOVE - RIGHT horizontally
- **Expected**: REPORT button centered below the three main buttons
- **Expected**: Consistent spacing between all buttons

#### Test 3.2: Button States
- **Setup**: No robot placed
- **Expected**: All buttons disabled and grayed out
- **Setup**: Robot placed
- **Expected**: All buttons enabled with proper styling

### Test Group 4: Boundary Testing (Frontend Validation)

#### Test 4.1: North Boundary
- **Setup**: Place robot at any position with Y=4
- **Action**: Face NORTH and attempt MOVE
- **Expected**: Robot does not move beyond Y=4
- **Expected**: No backend call made

#### Test 4.2: South Boundary
- **Setup**: Place robot at any position with Y=0
- **Action**: Face SOUTH and attempt MOVE
- **Expected**: Robot does not move below Y=0

#### Test 4.3: East Boundary
- **Setup**: Place robot at any position with X=4
- **Action**: Face EAST and attempt MOVE
- **Expected**: Robot does not move beyond X=4

#### Test 4.4: West Boundary
- **Setup**: Place robot at any position with X=0
- **Action**: Face WEST and attempt MOVE
- **Expected**: Robot does not move below X=0

### Test Group 5: Keyboard Controls

#### Test 5.1: Arrow Key Navigation
- **Setup**: Place robot at (2,2)
- **Actions**: Test all arrow keys
  - Up Arrow: Should execute MOVE
  - Left Arrow: Should execute LEFT turn
  - Right Arrow: Should execute RIGHT turn
- **Expected**: Same instant behavior as clicking buttons

#### Test 5.2: Spacebar Report
- **Setup**: Place robot at any position
- **Action**: Press Spacebar
- **Expected**: Same as clicking REPORT button

#### Test 5.3: Keyboard Without Robot
- **Setup**: No robot placed
- **Action**: Press any arrow key or spacebar
- **Expected**: No action should occur

### Test Group 6: Persistence and History

#### Test 6.1: Page Refresh
- **Setup**: Place robot at (3,1) facing EAST, make several moves
- **Action**: Refresh the browser page
- **Expected**: Robot reappears at last position and direction after page loads
- **Expected**: History preserved in backend

#### Test 6.2: History Tracking
- **Setup**: Place robot and execute 5-10 different commands
- **Action**: Check `/robot/history` endpoint
- **Expected**: Each action (place, move, turn) creates separate history record
- **Expected**: Records ordered by ID (most recent first)

### Test Group 7: Performance Testing

#### Test 7.1: Rapid Commands
- **Action**: Rapidly click movement buttons or use keyboard
- **Expected**: All commands execute instantly without lag
- **Expected**: UI remains responsive during rapid input

#### Test 7.2: Offline Capability
- **Setup**: Place robot and disconnect from backend
- **Action**: Try moving robot around
- **Expected**: Robot logic continues to work (frontend-driven)
- **Expected**: UI updates normally even without backend

### Test Group 8: Example Test Cases from Requirements

#### Test 8.1: Example A
- **Actions**:
  1. Place robot at (0,0)
  2. MOVE
  3. REPORT
- **Expected Output**: X: 0, Y: 1, Direction: NORTH

#### Test 8.2: Example B
- **Actions**:
  1. Place robot at (0,0)
  2. LEFT
  3. REPORT
- **Expected Output**: X: 0, Y: 0, Direction: WEST

#### Test 8.3: Example C
- **Actions**:
  1. Place robot at (1,2)
  2. MOVE
  3. MOVE
  4. RIGHT
  5. MOVE
  6. REPORT
- **Expected Output**: X: 2, Y: 4, Direction: EAST

## API Testing

### Using curl or Postman

#### Test API 1: Get Current Robot (Empty)
```bash
curl http://localhost:3000/robot/current
```
**Expected**: `{}` (empty object when no robot)

#### Test API 2: Save Robot State
```bash
curl -X POST http://localhost:3000/robot/move \
  -H "Content-Type: application/json" \
  -d '{"x": 2, "y": 3, "direction": "NORTH"}'
```

#### Test API 3: Get Current Robot (With Data)
```bash
curl http://localhost:3000/robot/current
```
**Expected**: Robot object with id, x, y, direction, createdAt

#### Test API 4: Get Robot History
```bash
curl http://localhost:3000/robot/history
```
**Expected**: Array of robot states ordered by ID (descending)

## Automated Testing

### Backend Tests
```bash
cd backend
npm test
```
**Expected**: Tests for `saveRobotState`, `getCurrentRobot`, `getRobotHistory`

### Frontend Tests
```bash
cd frontend
npm test
```
**Expected**: All React component tests pass

## Architecture Benefits Testing

### Test A1: Instant Response
- **Action**: Compare response time of button clicks vs old API-driven approach
- **Expected**: Immediate visual feedback (no network delay)

### Test A2: Offline Functionality
- **Setup**: Disconnect network after loading page
- **Action**: Place and move robot
- **Expected**: Full functionality works without backend

### Test A3: History Accuracy
- **Setup**: Perform complex sequence of moves
- **Verification**: Backend history matches exact sequence of frontend actions

## Browser Compatibility

Test the application in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected**: Consistent instant behavior across all browsers

## Performance Benchmarks

- **Robot Placement**: < 16ms (1 frame)
- **Movement Commands**: < 16ms (1 frame)
- **Turn Commands**: < 16ms (1 frame)
- **Report Generation**: < 5ms
- **Backend Persistence**: Asynchronous (non-blocking)

## Bug Report Template

When reporting issues, include:
1. **Browser**: Version and type
2. **Steps to Reproduce**: Detailed step-by-step
3. **Expected Result**: What should happen
4. **Actual Result**: What actually happened
5. **Network Status**: Online/offline during issue
6. **Screenshots**: If visual issue
7. **Backend Logs**: If persistence issue

## Test Quality and Maintenance

### Test Architecture Benefits
- **Modular Structure**: Each component/hook has its own test file for maintainability
- **Comprehensive Mocking**: Proper axios mocking using `__mocks__` directory pattern
- **Integration Coverage**: Tests cover full user workflows from UI interactions to API calls
- **Error Resilience**: Extensive error scenario testing ensures robust error handling
- **Accessibility Focus**: ARIA labels and keyboard navigation properly tested

### Test Maintenance Guidelines
- **Keep Tests Updated**: When adding new features, add corresponding tests
- **Mock Management**: Use the established `__mocks__/axios.ts` pattern for API mocking
- **Test Isolation**: Each test should be independent and not rely on other tests
- **Descriptive Naming**: Test names should clearly describe the expected behavior
- **Async Patterns**: Use `waitFor` and `act` consistently for async operations

## Test Sign-off Checklist

### Automated Tests ✅
- [x] **85 automated tests** covering all major functionality
- [x] **API service layer** fully tested with proper mocking
- [x] **Robot business logic** comprehensively tested
- [x] **UI components** tested for rendering and interactions
- [x] **Integration workflows** tested end-to-end
- [x] **Error scenarios** and edge cases covered
- [x] **Accessibility features** tested (ARIA, keyboard navigation)

### Manual Testing
- [ ] All robot placement tests pass with instant feedback
- [ ] All movement commands work instantly without API delays
- [ ] Boundary validation prevents invalid moves (frontend logic)
- [ ] Keyboard controls function with same instant response
- [ ] Robot state persists across page refreshes
- [ ] All example test cases produce correct output instantly
- [ ] Frontend validation prevents all invalid operations
- [ ] UI/UX provides immediate feedback for all actions
- [ ] Backend correctly saves all state changes for history
- [ ] History API returns complete sequence of actions
- [ ] Application performs optimally with frontend-driven architecture
- [ ] Cross-browser compatibility verified with instant responses 