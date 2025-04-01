// validators/user.validator.ts

import * as Joi from 'joi';

/**
 * Validation schema for email OTP request
 */
export const emailOtp = Joi.object({
  emailId: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email address is required',
    'any.required': 'Email address is required'
  })
});

/**
 * Validation schema for OTP verification
 */
export const verifyOtp = Joi.object({
  emailId: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email address is required',
    'any.required': 'Email address is required'
  }),
  otp: Joi.string().pattern(/^[0-9]{4,6}$/).required().messages({
    'string.pattern.base': 'OTP must be a 4-6 digit number',
    'string.empty': 'OTP is required',
    'any.required': 'OTP is required'
  })
});

/**
 * Validation schema for Google login
 */
export const googleLogin = Joi.object({
  access_token: Joi.string().required().messages({
    'string.empty': 'Access token is required',
    'any.required': 'Access token is required'
  })
});

/**
 * Validation schema for user profile update
 */
export const updateProfile = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  handle: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).messages({
    'string.min': 'Handle must be at least 3 characters long',
    'string.max': 'Handle cannot exceed 30 characters',
    'string.pattern.base': 'Handle can only contain letters, numbers, and underscores'
  })
});