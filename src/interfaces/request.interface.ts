import { Request } from 'express';
import { Types } from 'mongoose';

/**
 * Extended Request interface that includes authenticated user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    [key: string]: any;  // For any other properties the user object might have
  };
  query: {
    userObjectId: Types.ObjectId;
    workspaceObjectId: Types.ObjectId;
    [key: string]: any;  // For any other properties the user object might have
  };
  body: {
    userObjectId: Types.ObjectId;
    workspaceObjectId: Types.ObjectId;
    [key: string]: any;  // For any other properties the user object might have
  };
}
