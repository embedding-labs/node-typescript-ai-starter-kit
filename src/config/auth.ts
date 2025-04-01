// config/auth.ts

export const authConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-key',
    accessTokenExpiry: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiry: process.env.JWT_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'your-app-name',
  },
  
  // OTP Configuration
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '4', 10),
    expiry: parseInt(process.env.OTP_EXPIRY || '10', 10), // minutes
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    resendDelay: parseInt(process.env.OTP_RESEND_DELAY || '60', 10), // seconds
  },
  
  
  // Rate Limiting for Auth Endpoints
  rateLimiting: {
    loginWindow: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // 15 minutes in ms
    loginMaxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10),
    otpWindow: parseInt(process.env.OTP_RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000,
    otpMaxAttempts: parseInt(process.env.OTP_RATE_LIMIT_MAX || '3', 10),
  },
  
  // Account Lockout Policy
  accountLockout: {
    enabled: process.env.ACCOUNT_LOCKOUT_ENABLED === 'true',
    maxFailedAttempts: parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '30', 10) * 60 * 1000, // 30 minutes in ms
  },
};

export default authConfig;

