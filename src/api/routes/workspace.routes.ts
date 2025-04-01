import { Router, Request, Response, NextFunction } from 'express';
import * as workspaceController from '../../controllers/workspace.controller';

const router = Router();

// Async handler to catch errors in async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };


// checking if the user is authenticated
router.get('/', asyncHandler(workspaceController.checkUserAuth));

// Workspace home route
router.get('/home', asyncHandler(workspaceController.home));

export default router;
