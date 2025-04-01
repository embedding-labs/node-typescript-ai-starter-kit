// middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';
import mongoose from 'mongoose';
import WorkspaceMember from '../models/workspace-member.model';

// Extend Request interface to include user and errorMessage properties
declare global {
  namespace Express {
    interface Request {
      user?: any;
      errorMessage?: string;
      workspaceObjectId?: mongoose.Types.ObjectId;
      userObjectId?: mongoose.Types.ObjectId;
    }
  }
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const NON_SECURE_PATHS = [
  '/user/auth/email/send-otp', 
  '/user/auth/email/verify-otp', 
  '/user/auth/google/verify', 
  '/upload/image',
  '/public/*'
];

/**
 * Check if a path is in the non-secure paths list
 * @param path Request path
 * @returns boolean indicating if path is non-secure
 */
const isNonSecurePath = (path: string): boolean => {
  // Remove API version prefixes like /api/v1/ to match against core paths
  const normalizedPath = path.replace(/^\/api(\/v\d+)?/, '');
  
  return NON_SECURE_PATHS.some(nonSecurePath => {
    // Exact match with either original or normalized path
    if (path === nonSecurePath || normalizedPath === nonSecurePath) {
      console.log('Exact match', path, nonSecurePath);
      return true;
    }
    
    // Handle wildcard paths
    if (nonSecurePath.endsWith('*')) {
      const prefix = nonSecurePath.slice(0, -1);
      return path.startsWith(prefix) || normalizedPath.startsWith(prefix);
    }
    return false;
  });
};

/**
 * Middleware to authenticate requests using JWT tokens
 * This also adds userId and workspaceId to both query and body
 * Converts IDs to MongoDB ObjectId when possible
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  // Check if the path is in the non-secure paths list
  if (isNonSecurePath(req.path)) {
    let workspaceId = req.headers['x-workspace-id'] as string;
    if(workspaceId){
      req.body.workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
      req.query.workspaceObjectId = workspaceId; // String version for query
    }
    return next();
  }
  
  // Get token from header, query, or body
  const tokenHeader = req.headers['authorization'] || req.headers['Authorization'] as string;
  const token = req.body.token || req.query.token || tokenHeader;
  
  // Verify and decode token
  try {
    if (token && typeof token === 'string' && token.split(' ').length === 2) {
      // Extract token from "Bearer token" format
      const actualToken = token.split(' ')[1];
      
      // Decode the token
      const decoded = jwt.decode(actualToken, JWT_SECRET);
      
      if (!decoded) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      // Attach decoded user info to request
      req.user = decoded;
      
      // ===== USER ID HANDLING =====
      // Set userId in both query and body
      if (decoded.userId) {
        const userId = decoded.userId;
        
        
        // Add MongoDB ObjectId version if valid
        if (mongoose.Types.ObjectId.isValid(userId)) {
          req.body.userObjectId = new mongoose.Types.ObjectId(userId);
          req.query.userObjectId = userId; // String version for query
        }
      }
      
      // ===== WORKSPACE ID HANDLING =====
      // Handle workspace ID from headers
      const workspaceId = req.headers['x-workspace-id'] as string;
      
      // Set workspaceId if available
      if (workspaceId) {
        console.log("workspaceId in auth middleware", workspaceId);
        
        // Add MongoDB ObjectId version if valid
        if (mongoose.Types.ObjectId.isValid(workspaceId)) {
          req.body.workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
          req.query.workspaceObjectId = workspaceId; // String version for query
        }
      } else {
        // If no workspaceId, only allow access to workspace/home endpoint
        console.log("req.path in auth middleware", req.path);
        if (!req.url.includes('/workspace/home')) {
          return res.status(403).json({
            success: false,
            message: 'Workspace ID is required for this endpoint'
          });
        }
      }
      
      // Log the final request state for debugging
      console.log("Final req.body in auth middleware:", {
        userObjectId: req.body.userObjectId,
        workspaceObjectId: req.body.workspaceObjectId
      });
      
      next();
    } else {
      req.errorMessage = 'No token provided';
      return res.status(403).json({
        success: false,
        message: 'No token provided'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user has access to a workspace
 * Can be used after the authenticate middleware
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
const checkWorkspaceAccess = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    // Get workspaceId from any available source
    const workspaceId = req.body.workspaceId || req.query.workspaceId || req.headers['x-workspace-id'] as string;
    const userId = req.user?.userId;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: 'Workspace ID is required'
      });
    }

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user is a member of the workspace
    const workspaceMember = await WorkspaceMember.findOne({
      workspaceId,
      userId,
      status: 'active'
    });

    if (!workspaceMember) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this workspace'
      });
    }

    // Add workspace member role to the request if needed
    // req.user.workspaceRole = workspaceMember.role;
    
    next();
  } catch (error) {
    console.error('Workspace access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify workspace access'
    });
  }
};

// Export middleware functions
export default {
  authenticate,
  checkWorkspaceAccess
};