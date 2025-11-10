
# Devices API

A REST API for managing devices built with **Test-Driven Development (TDD)** and **Domain-Driven Design (DDD)** principles, featuring MongoDB integration, comprehensive logging, and Docker support.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+**
- **MongoDB** (local installation or Docker)
- **Docker** and **Docker Compose** (optional, for containerized setup)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dleandro/device-api.git
   cd device-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB configuration
   ```

4. **Start MongoDB locally:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or use your local MongoDB installation
   ```

5. **Run the application:**
   ```bash
   # Development mode with file watching
   npm run dev

   # Production mode
   npm run start
   ```

6. **API will be available at:** `http://localhost:8000`

### Docker Setup

#### Development Environment
```bash
# Start all services (API + MongoDB + Mongo Express)
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:dev:down
```

#### Production Environment
```bash
# Build and start production containers
npm run docker:up

# Stop production containers
npm run docker:down
```

**Services:**
- **API**: `http://localhost:8000`
- **MongoDB**: `localhost:27017`
- **Mongo Express** (Admin UI): `http://localhost:8081` (with `--profile admin`)

## 📖 API Documentation

### Available Endpoints

#### Standard Device Controller (`/device`)
- **GET** `/device` - Get all devices with optional filtering
- **GET** `/device/{id}` - Get device by ID
- **POST** `/device` - Create a new device
- **PUT** `/device/{id}` - Update device
- **DELETE** `/device/{id}` - Delete device

#### Async Device Controller (`/async-device`) - MongoDB
- **GET** `/async-device` - Get all devices from MongoDB
- **GET** `/async-device/{id}` - Get device by ID from MongoDB
- **POST** `/async-device` - Create device in MongoDB
- **PUT** `/async-device/{id}` - Update device in MongoDB
- **DELETE** `/async-device/{id}` - Delete device from MongoDB

### API Schema & Testing

**OpenAPI Specification:**
- JSON: `openapi.json` (Postman-friendly)

**Import to Postman:**
1. Open Postman → Import → File
2. Select `openapi.json`
3. All endpoints will be pre-configured with examples

### Request/Response Examples

**Create Device:**
```json
POST /async-device
{
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "state": "active"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "state": "active",
  "createdAt": "2025-11-09T10:30:00.000Z"
}
```

**Get Devices with Filters:**
```
GET /async-device?brand=Apple&state=active
```

## 🏗️ Architecture & Design Principles

### Domain-Driven Design (DDD)

The project follows **DDD principles** with a clean architecture approach:

```
src/
├── application/           # Application Layer
│   ├── device/           # Device Use Cases (Services)
│   ├── dto/              # Data Transfer Objects
│   └── port/             # Interface Adapters
├── shared/               # Shared Kernel
│   ├── infrastructure/   # Infrastructure Layer
│   └── model/           # Domain Models & Interfaces
└── test/                # E2E Tests
```

**Key DDD Concepts Implemented:**

- **Entities**: `Device` with proper identity and lifecycle management
- **Value Objects**: `DeviceId`, `DeviceName`, `DeviceBrand`, `DeviceState`
- **Repositories**: Abstract data access with `Repository<T>` interface
- **Services**: Domain and Application services for business logic
- **Dependency Injection**: Clean separation of concerns using TypeDI

### Test-Driven Development (TDD)

**TDD Approach Used:**
1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code while keeping tests green

**Testing Strategy:**
- **E2E Tests**: Primary testing approach covering real API usage
- **Integration Tests**: Database and external service interactions
- **Unit Tests**: Domain logic and value object validation

**Test Structure:**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Coverage reports
```

### Clean Architecture Layers

**1. Domain Layer** (`src/application/device/model/`)
- Pure business logic
- No external dependencies
- Entities and Value Objects

**2. Application Layer** (`src/application/device/`)
- Use cases and services
- Orchestrates domain objects
- Defines interfaces for infrastructure

**3. Infrastructure Layer** (`src/shared/infrastructure/`)
- Database access (MongoDB)
- Web framework (Express)
- External service integrations

**4. Interface Layer** (`src/controller/`)
- HTTP controllers
- Request/response handling
- Input validation

## 🔧 Development Practices

### Code Quality & Standards

**Linting & Formatting:**
```bash
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix issues
```

**TypeScript Configuration:**
- Strict type checking enabled
- ESLint with TypeScript rules
- Prettier for consistent formatting

### Database Management

**Lazy Connection Pattern:**
- Database connections established on first use
- Automatic connection management
- Proper cleanup and error handling

**MongoDB Integration:**
- Mongoose for object modeling
- Connection pooling and retry logic
- Separate test database isolation

### Logging & Monitoring

**Structured Logging:**
- Request/response logging middleware
- Service-level error logging
- Performance monitoring
- Sensitive data sanitization

**Log Levels:**
- `INFO`: Normal application flow
- `WARN`: Potential issues (slow requests)
- `ERROR`: Application errors with context

### Security Best Practices

**Environment Variables:**
- No hardcoded secrets
- Environment-based configuration
- Docker secrets support ready

**Request Sanitization:**
- Automatic PII data redaction
- Header sanitization for logging
- Input validation on all endpoints

## 🧪 Testing

### Running Tests

#### Local Testing
```bash
# All tests (requires MongoDB to be running)
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

#### Docker Testing
```bash
# Run tests in Docker container (automatically starts MongoDB)
npm run docker:test

# Clean up Docker containers after testing
npm run docker:test:clean
```

The Docker test setup provides:
- **Isolated environment**: Tests run in containerized environment
- **Automatic MongoDB setup**: Database starts automatically and waits for readiness
- **Clean state**: Fresh container for each test run
- **CI/CD ready**: Same environment locally and in GitHub Actions

### E2E Test Features

- **Database isolation**: Separate test database
- **Clean state**: Database cleared between tests
- **Real HTTP requests**: Full integration testing
- **Authentication ready**: Configurable auth for tests

### Test Database Management

Tests automatically:
1. Set up isolated test database
2. Clear data between test suites
3. Close connections properly
4. Handle MongoDB connection lifecycle

## 🔐 Security

- **Environment variable management** with `.env` files
- **No hardcoded credentials** in version control
- **Docker secrets ready** for production
- **Request logging** with sensitive data sanitization

## 🐳 Docker Configuration

**Multi-stage builds** for optimized production images:
- Development stage with full toolchain
- Production stage with minimal runtime
- Security-focused with non-root user
- Health checks for all services

**Services:**
- **devices-api**: Main application container
- **mongodb**: Database with persistent storage
- **mongo-express**: Optional admin interface
- **test-runner**: Containerized test execution environment

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline (`.github/workflows/ci.yml`) that runs on every push and pull request:

#### Pipeline Features
- **Automated linting**: Code quality checks with ESLint
- **Comprehensive testing**: Unit and E2E tests with coverage reporting
- **MongoDB integration**: Automated database setup for testing
- **Clean environment**: Fresh containers for each CI run

#### Pipeline Jobs

**Lint and Test Job:**
- Node.js 20.x environment
- MongoDB 7.0 service container (same as production)
- Runs `npm run lint` and `npm run test`
- Generates test coverage reports
- Uploads to Codecov (optional)

#### Triggering the Pipeline
The pipeline automatically runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## 📈 Future Roadmap

### Future steps - not in any specific order of priority

* Setup rate limiting
* Setup authentication with API keys for the CUD endpoints
* Add pagination on the get endpoint response
* Add ObjectMothers in the future with faker or something in order to have more variety when creating the test objects and a better dev experience when creating those test objects
* Remove the constant id's for the container services, they could be in a single file as container-ids.ts
* Could have dependency injection for each environment (prod, dev, stg)
* Could improve the env variable configuration system by having a centralized getConfig with a defined type and configurations per environment
* Remove magic indexing on the tests '[0]' wouldn't be as necessary if we had object mothers
* Should improve the responses for errors
* Missing integration tests on domain validations and database operations
* Domain errors should be thrown from the domain only. That needs to be changed
* Had some transpilation issues (because of some libraries that are lacking maintenance) so at the moment only typescript is used to run the application, in the future those issues should be looked into

### Environment Configuration

**Development:** `.env` with local settings
**Production:** `.env` with production-grade security

## 🛠️ Technical Stack

**Runtime & Language:**
- Node.js 20+ with TypeScript
- ESM modules with tsx runtime

**Web Framework:**
- Express.js with routing-controllers
- TypeDI for dependency injection

**Database:**
- MongoDB 7.0 with Mongoose ODM
- Connection pooling and retry logic
- Lazy connection initialization

**Development:**
- Jest for testing framework
- ESLint + Prettier for code quality
- Docker & Docker Compose for containers

**Architecture Patterns:**
- Domain-Driven Design (DDD)
- Test-Driven Development (TDD)
- Clean Architecture
- Repository Pattern
- Dependency Injection

## 🏛️ Design Decisions Log

**1. Minimal Framework Approach**
No heavyweight backend framework used - Express.js provides sufficient functionality for this API scope while maintaining simplicity and performance.

**2. MongoDB Over Relational Database**
Chose MongoDB because:
- Single entity (Device) - no complex relationships requiring joins
- Document model fits device properties naturally
- Wide industry adoption and excellent Node.js support
- Flexible schema for future device property extensions

**3. E2E Testing Strategy**
Primary focus on E2E tests because:
- Closest to real production API usage
- Covers full integration stack (HTTP → Service → Database)
- Provides confidence in complete user workflows
- Domain logic is simple enough for E2E coverage

**4. Hybrid OOP/Functional Programming**
Combines both paradigms to effectively implement DDD:
- OOP for entities, value objects, and domain modeling
- Functional approach for services and data transformations
- Better expressiveness for business logic

**5. Single Entity Domain Model**
- Each primitive field has its own value object type
- Field validation encapsulated in value object creation
- Device manipulation orchestrated by application services
- Simple but extensible domain model

**6. OpenAPI JSON Format**
JSON format chosen over YAML for API specification:
- Better Postman import compatibility
- Easier programmatic processing
- Immediate usability for API consumers

**7. Lazy Database Connections**
Database connections established on first use:
- Faster application startup
- Resource efficiency
- Better error isolation
- Graceful handling of database unavailability

**8. Comprehensive Logging Strategy**
Structured logging at multiple levels:
- Request/response middleware for HTTP monitoring
- Service-level logging for business operations
- Error context capture for debugging
- Sensitive data sanitization for security

**9. DDD decisioning versus performance
There are some filtering operations done at the service level that could've been
done in the queries on the repository but for a first version and taking into account
that performance is not an issue atm I decided to follow DDD and try to make the maximum
amount of domain validations at the domain level
