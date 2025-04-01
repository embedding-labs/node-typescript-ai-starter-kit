# Node TypeScript Starter Template

A production-ready Node.js starter template with TypeScript, featuring a well-organized project structure, robust error handling, and built-in authentication support.

## Features

- 🚀 **TypeScript** - Write type-safe code with the latest ECMAScript features
- 🏗️ **Well-structured** - Organized codebase following best practices and design patterns
- 🔒 **Authentication Ready** - JWT-based authentication system
- 🔍 **Input Validation** - Request validation using Joi
- 📝 **API Documentation** - Swagger/OpenAPI documentation support
- 🔄 **MongoDB Integration** - Mongoose ODM for MongoDB
- 🛠️ **Development Tools** - Hot reloading, linting, and formatting


## Project Structure

```
src/
├── api/            # API route definitions and versioning
├── config/         # Configuration files and environment setup
├── constants/      # Application-wide constants and enums
├── controllers/    # Request handlers and business logic coordination
├── interfaces/     # TypeScript interfaces and types
├── libs/          # Third-party library configurations
├── middlewares/   # Express middlewares (auth, validation, etc.)
├── models/        # Database models and schemas
├── services/      # Business logic and external service integrations
├── utils/         # Utility functions and helper methods
├── validators/    # Request validation schemas
└── server.ts      # Application entry point
```

### Structure Explanation

- **api/**: Contains route definitions organized by feature or resource. Helps in versioning APIs and keeping routes modular.
  
- **config/**: Centralizes all configuration including database, server, and third-party service settings. Makes it easy to manage different environments.

- **constants/**: Stores application-wide constants, enums, and static data. Helps maintain consistency and makes updates easier.

- **controllers/**: Houses request handlers that coordinate between routes and services. Keeps business logic separate from route definitions.

- **interfaces/**: Contains TypeScript type definitions and interfaces. Ensures type safety across the application.

- **libs/**: Manages third-party library configurations and setups. Keeps external integrations organized and maintainable.

- **middlewares/**: Contains Express middlewares for authentication, logging, error handling, etc. Provides reusable request/response processing.

- **models/**: Defines database schemas and models. Centralizes data structure definitions and database interactions.

- **services/**: Implements core business logic and external service integrations. Keeps business rules isolated from HTTP layer.

- **utils/**: Contains helper functions and utility methods. Provides reusable code snippets across the application.

- **validators/**: Houses request validation schemas. Ensures data integrity and security at the API level.

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd node-typescript-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts development server with hot reloading
- `npm run build` - Builds the project for production
- `npm start` - Runs the built project
- `npm test` - Runs tests
- `npm run lint` - Runs linting
- `npm run format` - Formats code using Prettier

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 