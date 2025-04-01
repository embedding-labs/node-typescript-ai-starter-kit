import * as Joi from 'joi';

/**
 * Validation schema for image generation
 */
export const imageGeneration = Joi.object({
  textPrompt: Joi.string().required().messages({
    'string.empty': 'Text prompt is required',
    'any.required': 'Text prompt is required'
  }),

  sizeCode: Joi.string().required().messages({
    'string.empty': 'Size code is required',
    'any.required': 'Size code is required'
  }),

  noOfImages: Joi.number().integer().min(1).max(10).optional().messages({
    'number.base': 'Number of images must be a number',
    'number.integer': 'Number of images must be an integer',
    'number.min': 'Number of images must be at least 1',
    'number.max': 'Number of images cannot exceed 10'
  }),

});

/**
 * Validation schema for images history query
 */
export const imagesHistory = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(50).optional().default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 50'
  })
});
