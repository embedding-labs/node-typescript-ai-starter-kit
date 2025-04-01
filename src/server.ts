import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as path from 'path';
import fileUpload from 'express-fileupload';


// Load environment variables based on NODE_ENV
console.log(process.env.NODE_ENV);
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
if(process.env.NODE_ENV === 'development'){
  dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
}else{
  dotenv.config({ path: envFile });
}

import authMiddleware from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import responseMiddleware from './middlewares/response.middleware';

// Create Express app
const app = express();
import apiRoutes from './api/routes/index';

// Connect to MongoDB
import databaseConfig from './config/database';
mongoose.connect(databaseConfig.url, databaseConfig.options as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });


// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply authentication middleware to all routes (except those listed in nonSecurePaths)
app.use(authMiddleware.authenticate);

// used for uploading file
app.use(fileUpload());

// Add API response formatting methods
app.use(responseMiddleware.formatter);


// Routes
app.use('/api/v1', apiRoutes);
app.use(express.json({ limit: '50mb' })); // Parse JSON requests
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 404 handler - must be after all routes
app.use(errorMiddleware.notFound);

// Global error handler - must be after all other middleware
app.use(errorMiddleware.errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log error and exit gracefully
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log error but don't exit
});

// safely disconnecting db when server is stopped
process.on('SIGINT', () => {
  mongoose.disconnect().then(() => {
    console.log("exit")
      process.exit();
  });
});