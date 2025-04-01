// interfaces/user.interface.ts

import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  handle: string;
  emailId: string;
  isVerified: boolean;
  profilePic: string;
  password: string;
  googleId: string | null;
  onboardingCompleted: boolean;
  googleResponse: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMailOtp extends Document {
  emailId: string;
  otp: number;
  isUsed: number;
  createdAt: Date;
}

export interface EmailOtpRequest {
  emailId: string;
}

export interface VerifyMailOtpRequest {
  emailId: string;
  otp: string | number;
}

export interface GoogleLoginRequest {
  access_token: string;
}

export interface UserData {
  name: string;
  userId: string;
  isSignUp: boolean;
  emailId: string;
  profilePic: string;
  token: string;
}

export interface UserCreationParams {
  emailId: string;
  randomText: string | number;
  name: string;
}

export interface AnalyticsTrackUserParams {
  userId: string;
  name: string;
  emailId: string;
  isSignUp: boolean;
  avatar: string;
}

export interface AnalyticsTrackEventsParams {
  userId: string;
  eventName: string;
  properties: Record<string, any>;
}