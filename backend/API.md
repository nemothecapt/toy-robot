# Robot Simulator API Documentation

## Overview

This backend provides a simple REST API for the Toy Robot Simulator. It serves as a **persistence layer** in a frontend-driven architecture where all robot logic (movement, validation, boundary checking) is handled by the frontend.

**Base URL:** `http://localhost:3000`

## Architecture

- **Frontend-Driven**: All robot logic runs in the frontend for instant responses
- **Backend Role**: Only persists robot states for history tracking and page refresh restoration
- **Database**: SQLite for simple deployment and development

## API Endpoints

### 1. Get Current Robot State

```http
GET /robot/current
```

**Description:** Retrieves the most recent robot state from the database.

**Response:**
- **200 OK** - Returns robot object or empty object if no robot exists

```json
// With robot data
{
  "id": 5,
  "x": 2,
  "y": 3,
  "direction": "NORTH",
  "createdAt": "2025-06-23T10:30:00.000Z"
}

// No robot data
{}
```

### 2. Save Robot State

```http
POST /robot/move
```

**Description:** Saves a robot state to the database for history tracking.

**Request Body:**
```json
{
  "x": 2,
  "y": 3,
  "direction": "NORTH"
}
```

**Validation (RobotStateDto):**
- `x`: Number, 0-4 (grid boundaries)
- `y`: Number, 0-4 (grid boundaries) 
- `direction`: Enum, one of: "NORTH", "SOUTH", "EAST", "WEST"

**Note:** Request validation is handled by `RobotStateDto` with class-validator decorators for runtime type checking and boundary validation.

**Response:**
- **200 OK** - Returns saved robot entity with ID and timestamp
- **400 Bad Request** - Validation errors

```json
{
  "id": 6,
  "x": 2,
  "y": 3,
  "direction": "NORTH",
  "createdAt": "2025-06-23T10:31:00.000Z"
}
```

### 3. Get Robot History

```http
GET /robot/history
```

**Description:** Retrieves complete robot movement history ordered by ID (newest first).

**Response:**
- **200 OK** - Returns array of robot states

```json
[
  {
    "id": 6,
    "x": 2,
    "y": 3,
    "direction": "NORTH",
    "createdAt": "2025-06-23T10:31:00.000Z"
  },
  {
    "id": 5,
    "x": 2,
    "y": 2,
    "direction": "NORTH", 
    "createdAt": "2025-06-23T10:30:00.000Z"
  }
]
```

## Grid Coordinate System

```
(0,4) (1,4) (2,4) (3,4) (4,4)
(0,3) (1,3) (2,3) (3,3) (4,3)
(0,2) (1,2) (2,2) (3,2) (4,2)
(0,1) (1,1) (2,1) (3,1) (4,1)
(0,0) (1,0) (2,0) (3,0) (4,0)
```

- **Origin (0,0):** Bottom-left corner
- **X-axis:** 0-4, left to right
- **Y-axis:** 0-4, bottom to top

## Direction Values

- `NORTH`: Facing up (positive Y direction)
- `SOUTH`: Facing down (negative Y direction)
- `EAST`: Facing right (positive X direction)
- `WEST`: Facing left (negative X direction)

## Usage Flow

1. **Frontend loads** → Calls `GET /robot/current` to restore robot state
2. **User places/moves robot** → Frontend updates UI instantly, then calls `POST /robot/move` to save state
3. **View history** → Frontend calls `GET /robot/history` to show movement timeline

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "x must not be greater than 4",
    "direction must be one of the following values: NORTH, SOUTH, EAST, WEST"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Cannot GET /invalid-endpoint",
  "error": "Not Found"
}
```

## Development

**Start the server:**
```bash
npm run start:dev
```

**Run tests:**
```bash
npm test        # Unit tests
npm run test:e2e # End-to-end tests
```

**Database:**
- File: `toy-robot.db` (SQLite)
- Auto-created on first run
- Delete file to reset all data 