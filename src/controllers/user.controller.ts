// api/controllers/user.controller.ts

import { Request, Response } from 'express';
import { EmailOtpRequest, VerifyMailOtpRequest, GoogleLoginRequest } from '../interfaces/user.interface';
import { userService } from '../services/user.service';

// Add this interface to extend the Express Request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    [key: string]: any;  // For any other properties the user object might have
  };
}


/**
 * Send OTP to user's email for authentication
 * @param req Request with emailId in body
 * @param res Response object
 */
export const sendMailOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { emailId } = req.body as EmailOtpRequest;
    
    const result = await userService.sendMailOTP(emailId);
    
    return res.apiSuccess(result, 'OTP Sent!');
  } catch (error) {
    console.error('Error in sendMailOTP controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};

/**
 * Verify OTP sent to user's email
 * @param req Request with emailId and otp in body
 * @param res Response object
 */
export const verifyMailOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { emailId, otp } = req.body as VerifyMailOtpRequest;
    
    const result = await userService.verifyMailOTP(emailId, otp);
    
    if (!result.success) {
      return res.apiError(result.message, 400);
    }

    return res.apiSuccess(result.data, 'Successfully verified');
  } catch (error) {
    console.error('Error in verifyMailOTP controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};

/**
 * Verify Google login with access token
 * @param req Request with access_token in body
 * @param res Response object
 */
export const verifyGoogleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { access_token } = req.body as GoogleLoginRequest;
    
    const result = await userService.verifyGoogleLogin(access_token, req);
    
    if (!result.success) {
      return res.apiError(result.message, 400);
    }

    return res.apiSuccess(result.data, 'Successfully authenticated');
  } catch (error) {
    console.error('Error in verifyGoogleLogin controller:', error);
    return res.apiError('Invalid Verification Code!', 500);
  }
};

/**
 * Get user profile information
 * @param req Request with user info from auth middleware
 * @param res Response object
 */
export const profile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // The auth middleware should attach the user to the request
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.apiError('Unauthorized', 401);
    }

    const user = await userService.getUserProfile(userId);
    
    if (!user) {
      return res.apiError('User not found', 404);
    }

    return res.apiSuccess(user);
  } catch (error) {
    console.error('Error in profile controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};