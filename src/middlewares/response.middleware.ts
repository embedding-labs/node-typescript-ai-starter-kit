// middlewares/response.middleware.ts

import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  [key: string]: any;
}

interface ResponseMiddlewareOptions {
  failCodes?: number[];
  statusCodeKey?: string;
  errorProps?: Record<string, any>;
}

export class ResponseMiddleware {
  private failCodes: number[];
  private statusCodeKey: string;
  private errorProps: Record<string, any>;

  constructor(options: ResponseMiddlewareOptions = {}) {
    // Default codes that indicate a failure vs. an error
    this.failCodes = options.failCodes || [400, 401, 403, 404];
    
    // The property name to look for status codes in error objects
    this.statusCodeKey = options.statusCodeKey || 'statusCode';
    
    // Default properties to include in error responses
    this.errorProps = options.errorProps || {
      message: 'An unknown error occurred'
    };
  }

  /**
   * Add response formatting methods to the response object
   */
  public formatter = (req: Request, res: Response, next: NextFunction): void => {
    // Success response
    res.apiSuccess = (payload: any = null, message: string = 'Success'): Response => {
      return res.status(200).json({
        success: true,
        message,
        payload
      });
    };

    // Client error response
    res.apiError = (message: string = 'Error', statusCode: number = 400): Response => {
      return res.status(statusCode).json({
        success: false,
        message
      });
    };

    // Server error response with extended properties
    res.apiInternalError = (err: ErrorWithStatusCode): Response => {
      const response: Record<string, any> = {};
      
      // Copy relevant properties from the error or use defaults
      const validErr = err instanceof Error;
      for (const key in this.errorProps) {
        if (validErr && key in err) {
          response[key] = err[key];
        } else if (key in this.errorProps) {
          response[key] = this.errorProps[key];
        } else {
          response[key] = null;
        }
      }
      
      // Determine status code
      let statusCode = 500;
      if (validErr && this.statusCodeKey in err && typeof err[this.statusCodeKey] === 'number') {
        statusCode = err[this.statusCodeKey];
      }
      
      // Determine if this is a "fail" (client error) or "error" (server error)
      const failed = this.failCodes.includes(statusCode);
      response.status = failed ? 'fail' : 'error';
      
      return res.status(statusCode).json(response);
    };
    
    next();
  };
}

// Export as a singleton with default options
export default new ResponseMiddleware();

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      apiSuccess(data?: any, message?: string): Response;
      apiError(message?: string, statusCode?: number): Response;
      apiInternalError(err: ErrorWithStatusCode): Response;
    }
  }
}