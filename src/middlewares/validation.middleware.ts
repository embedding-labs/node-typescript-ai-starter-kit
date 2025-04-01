// middlewares/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { Types } from 'mongoose';

interface ValidationOptions {
  /** Whether to abort early, stopping validation on the first error */
  abortEarly?: boolean;
  /** Whether to strip unknown properties */
  stripUnknown?: boolean;
}

/**
 * Middleware factory for request validation using Joi schemas
 */
export const validate = (
  schema: Schema,
  options: ValidationOptions = { abortEarly: false, stripUnknown: true }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Preserve ObjectIds before validation
    const bodyUserObjectId = req.body.userObjectId;
    const bodyWorkspaceObjectId = req.body.workspaceObjectId;
    
    // Perform validation
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Replace request body with validated data
    req.body = value;
    
    // Restore ObjectIds after validation
    if (bodyUserObjectId) req.body.userObjectId = bodyUserObjectId;
    if (bodyWorkspaceObjectId) req.body.workspaceObjectId = bodyWorkspaceObjectId;
    
    return next();
  };
};

/**
 * Middleware factory for validating query parameters
 */
export const validateQuery = (
  schema: Schema,
  options: ValidationOptions = { abortEarly: false, stripUnknown: true }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Preserve ObjectIds before validation
    const queryUserObjectId = req.query.userObjectId;
    const queryWorkspaceObjectId = req.query.workspaceObjectId;
    
    // Perform validation
    const { error, value } = schema.validate(req.query, options);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error in query parameters',
        errors
      });
    }

    // Replace request query with validated data
    req.query = value;
    
    // Restore ObjectIds after validation
    if (queryUserObjectId) req.query.userObjectId = queryUserObjectId;
    if (queryWorkspaceObjectId) req.query.workspaceObjectId = queryWorkspaceObjectId;
    
    return next();
  };
};

/**
 * Middleware factory for validating URL parameters
 */
export const validateParams = (
  schema: Schema,
  options: ValidationOptions = { abortEarly: false, stripUnknown: true }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, options);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error in URL parameters',
        errors
      });
    }

    // Replace request params with validated data
    req.params = value;
    return next();
  };
};