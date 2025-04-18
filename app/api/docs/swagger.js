import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API documentation for the authentication service',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'admin', 'moderator'] },
            isEmailVerified: { type: 'boolean' },
            timezone: { type: 'string' },
            language: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'timezone', 'language'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            timezone: { type: 'string' },
            language: { type: 'string' },
            birthDate: { type: 'string', format: 'date', nullable: true },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            rememberMe: { type: 'boolean', default: false },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['error'] },
            code: { type: 'string' },
            message: { type: 'string' },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./app/api/routes/*.js'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);