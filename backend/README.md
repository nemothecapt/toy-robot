# Toy Robot Simulator - Backend

A NestJS-based backend service for the Toy Robot Simulator that provides persistence and history tracking for robot states.

## Architecture Overview

This backend uses a **simplified, frontend-driven architecture**:

- **Purpose**: Persistence layer for robot states and movement history
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **API Design**: Minimal RESTful endpoints optimized for frontend-driven logic
- **Philosophy**: Backend handles data persistence, frontend handles all robot logic

## Features

- **State Persistence**: Saves robot positions and directions to SQLite database
- **Movement History**: Maintains complete history of robot movements ordered by timestamp
- **Simplified API**: Only 3 endpoints needed for full functionality
- **Auto-Migration**: Database schema automatically created and updated
- **Error Handling**: Comprehensive error responses for API failures
- **CORS Enabled**: Configured for frontend communication on localhost:3001

## API Endpoints

### `POST /robot/move`
Saves a robot state to the database for history tracking.

**Request Body:**
```json
{
  "x": 2,
  "y": 3,
  "direction": "NORTH"
}
```

**Response:**
```json
{
  "id": 1,
  "x": 2,
  "y": 3,
  "direction": "NORTH",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### `GET /robot/current`
Returns the most recent robot state from the database.

**Response (with robot):**
```json
{
  "id": 5,
  "x": 1,
  "y": 4,
  "direction": "EAST",
  "createdAt": "2025-01-15T10:35:00.000Z"
}
```

**Response (no robot):**
```json
{}
```

### `GET /robot/history`
Returns complete movement history ordered by ID (most recent first).

**Response:**
```json
[
  {
    "id": 5,
    "x": 1,
    "y": 4,
    "direction": "EAST",
    "createdAt": "2025-01-15T10:35:00.000Z"
  },
  {
    "id": 4,
    "x": 1,
    "y": 3,
    "direction": "EAST",
    "createdAt": "2025-01-15T10:34:00.000Z"
  }
]
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
cd backend
npm install
```

### Development
```bash
# Start in development mode with hot reload
npm run start:dev

# Start in production mode
npm run start:prod

# Build the application
npm run build
```

The backend will start on `http://localhost:3000`

## Database

- **Type**: SQLite (file-based)
- **Location**: `./toy-robot.db`
- **ORM**: TypeORM with automatic migrations
- **Schema**: Single `robot` table with id, x, y, direction, createdAt columns

### Database Schema
```sql
CREATE TABLE robot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction VARCHAR(10) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## Project Structure

```
backend/
├── src/
│   ├── robot/
│   │   ├── controllers/robot.controller.ts    # API endpoints
│   │   ├── services/robot.service.ts          # Business logic
│   │   ├── entities/robot.entity.ts           # Database entity
│   │   ├── dto/place-robot.dto.ts             # Data validation
│   │   └── robot.module.ts                    # Module configuration
│   ├── app.module.ts                          # Main application module
│   └── main.ts                                # Application bootstrap
├── test/                                      # E2E tests
├── toy-robot.db                               # SQLite database file
└── package.json
```

## Design Decisions

### Why This Architecture?
1. **Frontend-First**: All robot logic (movement, validation, turning) handled in React for instant UI updates
2. **Minimal Backend**: Only handles persistence, reducing API calls and improving performance
3. **History Tracking**: Every robot action creates a database record for complete audit trail
4. **Stateless API**: Each request is independent, making the backend simple and scalable

### Technical Choices
1. **SQLite**: Perfect for local development and demonstrations, easily upgradeable to PostgreSQL
2. **TypeORM**: Excellent TypeScript integration with automatic migrations
3. **NestJS**: Provides robust structure while keeping the API simple
4. **CORS Configuration**: Allows frontend communication during development

## Environment Configuration

Create a `.env` file for environment-specific settings:

```env
# Database
DATABASE_PATH=./toy-robot.db

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001
```

## Deployment

### Local Production
```bash
npm run build
npm run start:prod
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main"]
```

## API Testing

### Using curl
```bash
# Save a robot state
curl -X POST http://localhost:3000/robot/move \
  -H "Content-Type: application/json" \
  -d '{"x": 2, "y": 3, "direction": "NORTH"}'

# Get current robot
curl http://localhost:3000/robot/current

# Get movement history
curl http://localhost:3000/robot/history
```

### Using Postman
Import the API collection from `API.md` for comprehensive testing scenarios.

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful operations
- `201 Created` - Robot state saved successfully
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Database or server errors

## Contributing

1. Follow TypeScript best practices
2. Add unit tests for new services
3. Update API documentation for endpoint changes
4. Ensure database migrations are backwards compatible
5. Test with the frontend to ensure integration works

