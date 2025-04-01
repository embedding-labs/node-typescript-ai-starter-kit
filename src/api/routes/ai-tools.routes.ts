import { Router, Request, Response, NextFunction } from 'express';
import aiToolsController from '../../controllers/ai-tools.controller';
import * as aiToolsValidator from '../../validators/ai-tools.validator';
import { validate } from '../../middlewares/validation.middleware';
import { AuthenticatedRequest } from '../../interfaces/request.interface';

const router = Router();

// Async handler to catch errors in async route handlers
const asyncHandler = (fn: (req:  AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };

// AI Tools routes
// Image Generator
router.post(
  '/generators/images',  // Create a new image
  validate(aiToolsValidator.imageGeneration),
  asyncHandler(aiToolsController.generateImages)
);

router.get(
  '/generators/images/history',
  validate(aiToolsValidator.imagesHistory),
  asyncHandler(aiToolsController.getImagesHistory)
);



export default router;
