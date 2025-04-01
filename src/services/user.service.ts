// services/user.service.ts

import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jwt-simple';
import moment from 'moment';
import { 
  IUser, 
  IMailOtp, 
  UserData, 
  UserCreationParams
} from '../interfaces/user.interface';
// import { sentOtpMail } from './email.service';
import { googleAuthConfig, authConfig } from '../config';

// Import models
import User from '../models/user.model';
import MailOtp from '../models/mail-otp.model';
import analyticsUtil from '../utils/analytics.util';

// Define Google OAuth user info response type
interface GoogleUserInfo {
  sub: string;
  name: string;
  picture: string;
  email: string;
  [key: string]: any;
}

// Extended UserCreationParams to include Google-specific fields
interface ExtendedUserCreationParams extends UserCreationParams {
  googleId?: string;
  googleResponse?: Record<string, any>;
  profilePic?: string;
}

// Constants
const jwtSecret = authConfig.jwt.secret;
const defaultProfilePic = 'https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4';
const googleClient = new OAuth2Client(googleAuthConfig.client.id);

// -------------------------------------------------------------------------
// PUBLIC FUNCTIONS
// -------------------------------------------------------------------------

/**
 * Generate and send OTP to user's email
 * @param emailId User's email address
 * @returns Success message
 */
async function sendMailOTP(emailId: string): Promise<boolean> {
  try {
    emailId = emailId.toLowerCase();
    
    const max = 999999;
    const min = 100000;
    let otp = Math.floor(Math.random() * (max - min + 1) + min);
    
    // For development environments, use a fixed OTP
    if (process.env.NODE_ENV !== 'production') {
      otp = 1234;
    }
    
    otp = 1234;
    
    // Create OTP record in database
    await MailOtp.create({ emailId, otp, isUsed: 0 });
    
    // Send OTP email (skip in development with fixed OTP)
    if (otp !== 1234) {
      // await sentOtpMail({ emailId, otp });
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendMailOTP service:', error);
    throw error;
  }
}

/**
 * Verify OTP sent to user's email
 * @param emailId User's email address
 * @param otp OTP to verify
 * @param req Express request object for event emitter
 * @returns User data with token
 */
async function verifyMailOTP(emailId: string, otp: string | number): Promise<{ success: boolean; message?: string; data?: UserData }> {
  try {
    emailId = emailId.toLowerCase();
    
    // Find valid OTP in database
    const fifteenMinutesAgo = moment().subtract(15, 'minutes').toDate();
    const mailOtp = await MailOtp.findOne({
      emailId, 
      otp, 
      isUsed: 0, 
      createdAt: { $gt: fifteenMinutesAgo }
    });
    
    if (!mailOtp) {
      return { success: false, message: 'Invalid Verification Code!' };
    }
    
    // Mark all OTPs for this email as used
    await MailOtp.updateMany({ emailId }, { isUsed: 1 });
    
    // Create or get user and generate token
    const name = emailId.substring(0, emailId.indexOf('@'));
    const userData = await checkAndCreateNewUser({
      emailId,
      randomText: mailOtp.otp,
      name
    });
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Error in verifyMailOTP service:', error);
    throw error;
  }
}

/**
 * Verify Google login with access token
 * @param accessToken Google OAuth access token
 * @param req Express request object for event emitter
 * @returns User data with token
 */
async function verifyGoogleLogin(accessToken: string, req: any): Promise<{ success: boolean; message?: string; data?: UserData }> {
  try {
    // Verify the access token
    const tokenInfo = await googleClient.getTokenInfo(accessToken);
    
    // Get user info from Google using the configured scopes and mappings
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!response.ok) {
      return { success: false, message: 'Failed to fetch user info' };
    }
    
    const payload = await response.json() as GoogleUserInfo;
    
    // Extract user information using the field mappings from config
    const mapping = googleAuthConfig.userProfileMapping;
    const googleId = payload.sub;
    const name = payload[mapping.nameField] as string;
    const picture = payload[mapping.pictureField] as string;
    const email = (payload[mapping.emailField] as string).toLowerCase();
    
    // Check if user exists and update or create as needed
    const userData = await checkAndCreateNewUser({
      emailId: email,
      randomText: googleId,
      name,
      googleId,
      googleResponse: payload,
      profilePic: picture
    });
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Error in verifyGoogleLogin service:', error);
    throw error;
  }
}

/**
 * Get user profile by ID
 * @param userId User ID
 * @returns User profile data
 */
async function getUserProfile(userId: string): Promise<Partial<IUser> | null> {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return null;
    }
    
    // Return user data without sensitive information
    return {
      name: user.name,
      handle: user.handle,
      emailId: user.emailId,
      isVerified: user.isVerified,
      profilePic: user.profilePic,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('Error in getUserProfile service:', error);
    throw error;
  }
}

// -------------------------------------------------------------------------
// PRIVATE FUNCTIONS
// -------------------------------------------------------------------------

/**
 * Check if user exists and create if not
 * @param params User creation parameters
 * @returns User data with token
 */
const  checkAndCreateNewUser = async (params: ExtendedUserCreationParams): Promise<UserData> => {
  const { 
    emailId, 
    randomText, 
    name, 
    googleId, 
    googleResponse, 
    profilePic 
  } = params;
  
  let user = await User.findOne({ emailId });
  let isSignUp = false;
  let userProfilePic = defaultProfilePic;
  
  if (!user) {
    // Create new user
    const userData: any = {
      emailId,
      password: `${randomText}`,
      isVerified: true,
      name,
      profilePic: profilePic || defaultProfilePic
    };
    
    // Add Google-specific fields if present
    if (googleId) {
      userData.googleId = googleId;
    }
    
    if (googleResponse) {
      userData.googleResponse = googleResponse;
    }
    
    user = await User.create(userData);
    isSignUp = true;
  } else if (googleId) {
    // Update existing user with Google info if this is a Google login
    await User.updateOne(
      { _id: user.id },
      { 
        name, 
        profilePic: profilePic || user.profilePic, 
        googleId, 
        googleResponse,
        isVerified: true
      }
    );
  }
  
  // Use profile pic from params if provided, otherwise use existing or default
  if (profilePic) {
    userProfilePic = profilePic;
  } else if (user.profilePic) {
    userProfilePic = user.profilePic;
  }
  
  // Prepare response data
  const userData: UserData = {
    name: user.name,
    isSignUp,
    userId: user.id.toString(),
    emailId: user.emailId,
    profilePic: userProfilePic,
    token: jwt.encode({
      userId: user.id.toString(),
      time: new Date().getTime()
    }, jwtSecret),
  };
    analyticsUtil.trackUser({userId : user.id,  name : user.name, emailId : user.emailId,  isSignUp, avatar : userProfilePic})
    analyticsUtil.trackEvents({userId : user.id, eventName : "User Signed In", properties :{emailId : user.emailId, name : user.name, mode : googleId ? "gmail" : "emailotp"}})
    return userData;
}

// Export as a service object
export const userService = {
  sendMailOTP,
  verifyMailOTP,
  verifyGoogleLogin,
  getUserProfile
};