// api/routes/user.routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import * as userController from '../../controllers/user.controller';

import * as userValidator from '../../validators/user.validator';
import { validate } from '../../middlewares/validation.middleware';

const router = Router();

// Async handler to catch errors in async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Authentication routes
router.post(
  '/auth/email/send-otp', 
  validate(userValidator.emailOtp),
  asyncHandler(userController.sendMailOTP)
);

router.post(
  '/auth/email/verify-otp', 
  validate(userValidator.verifyOtp),
  asyncHandler(userController.verifyMailOTP)
);

router.post(
  '/auth/google/verify', 
  validate(userValidator.googleLogin),
  asyncHandler(userController.verifyGoogleLogin)
);

// User profile routes (requires authentication)
router.get('/profile', asyncHandler(userController.profile));

export default router;