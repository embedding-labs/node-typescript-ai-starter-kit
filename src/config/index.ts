// config/index.ts

import databaseConfig from './database';
import authConfig from './auth';
import awsConfig from './aws';
import googleAuthConfig from './google-auth';
import emailConfig from './email';
import aiServicesConfig from './ai-services';

/**
 * Export all configuration objects from a single file
 * This allows for easier imports throughout the application
 * Example: import { authConfig, databaseConfig } from '../config';
 */
export {
  databaseConfig,
  authConfig,
  googleAuthConfig,
  emailConfig,
  awsConfig,
  aiServicesConfig,
};

/**
 * Combined configuration object that contains all configs
 * Useful for when you need to pass around the entire configuration
 */
const config = {
  database: databaseConfig,
  auth: authConfig,
  googleAuth: googleAuthConfig,
  email: emailConfig,
  aws: awsConfig,
  aiServices: aiServicesConfig,
  
  // Environment settings
  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '8080', 10),
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
  },
  
  // Application settings
  app: {
    name: process.env.APP_NAME || 'Node Typescript App',
    url: process.env.APP_URL || 'https://localhost:8080',
    apiPrefix: process.env.API_PREFIX || '/api',
    version: process.env.APP_VERSION || '1.0.0',
    corsOrigins: (process.env.CORS_ORIGINS || '*').split(','),
  },
  
};

export default config;