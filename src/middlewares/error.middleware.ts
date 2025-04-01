// middlewares/error.middleware.ts

import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  [key: string]: any;
}

export class ErrorMiddleware {
  /**
   * Handle 404 errors
   */
  public notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404);
    const error: ErrorWithStatusCode = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  };

  /**
   * Global error handler
   */
  public errorHandler = (err: ErrorWithStatusCode, req: Request, res: Response, next: NextFunction): Response => {
    // Use existing status code or default to 500 if it was 200
    const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
    
    // Log the error stack in all environments
    console.error(`[${new Date().toISOString()}] Error:`, err.message);
    console.error(err.stack);
    
    // Format the response based on environment
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Handler for async route errors
   * Wraps an async function to catch errors and pass them to next()
   */
  public asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Export as a singleton
export default new ErrorMiddleware();