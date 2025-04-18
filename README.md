# O Estudador

This repository contains both the frontend and backend applications for O Estudador, following the hexagonal architecture pattern.

## Project Structure

```
.
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── package.json   # Frontend dependencies
│   └── vite.config.ts # Frontend build configuration
│
└── backend/           # Node.js backend application
    ├── app/           # Application code
    ├── core/          # Business logic
    ├── infra/         # Infrastructure code
    ├── db/            # Database files
    ├── .docker/       # Docker configuration
    ├── index.js       # Entry point
    ├── .env           # Environment variables
    └── docker-compose.yml # Docker services
```

## Getting Started

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. To run with Docker:
```bash
docker-compose up
```

## Architecture

The backend follows the hexagonal architecture pattern, where:

- `app`: Contains application-specific code
- `core`: Contains the business logic and domain models
- `infra`: Contains the infrastructure code for external services

The frontend follows a standard React application structure with Vite as the build tool. 