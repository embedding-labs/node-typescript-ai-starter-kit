import { Router, Request, Response, NextFunction } from 'express';
import * as publicController from '../../controllers/public.controller';

const router = Router();

// Async handler to catch errors in async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/upload/image', asyncHandler((req, res, next) => {return publicController.uploadImageToS3(req, res)}))



router.get('/', asyncHandler((req, res, next) => {return publicController.checkApi(req, res)}))

export default router; 