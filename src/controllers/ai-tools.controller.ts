import { Request, Response } from 'express';
import imageGeneratorService from '../services/tools/image-generator.service';
import { ImageGenerationRequest } from '../interfaces/ai-tools.interface';
import { AuthenticatedRequest } from '../interfaces/request.interface';

// Controller object with all functions
const aiToolsController = {
  /**
   * Generate image based on text prompt
   * @param req - Express request object
   * @param res - Express response object
   */
  generateImages: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { textPrompt, styleCode, modelId, noOfImages, sizeCode } = req.body;
      console.log(req.body);
      
      const userObjectId = req.body.userObjectId;
      const workspaceObjectId = req.body.workspaceObjectId;
      // Create image generation request data
      const imageGenerationData: ImageGenerationRequest = {
        textPrompt,
        sizeCode,
        noOfImages: noOfImages || 1
      };

      // Generate image
      const result = await imageGeneratorService.generateImage(
        userObjectId,
        workspaceObjectId,
        imageGenerationData
      );
      
      if (result.success) {
        return res.apiSuccess(result.data, result.message);
      } else {
        return res.apiError(result.message, 400);
      }
    } catch (error) {
      console.error('Error in generateImage controller:', error);
      return res.apiError(error instanceof Error ? error.message : 'Internal server error', 500);
    }
  },

  /**
   * Get art history with pagination
   * @param req - Express request object
   * @param res - Express response object
   */
  getImagesHistory: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const pageStr = req.query.page as string || '1';
      const limitStr = req.query.limit as string || '10';
      
      // Get pre-converted ObjectIds
      const userObjectId = req.query.userObjectId;
      const workspaceObjectId = req.query.workspaceObjectId;
      
      // Parse pagination parameters
      const page = parseInt(pageStr, 10);
      const limit = parseInt(limitStr, 10);
      // Get art history
      const result = await imageGeneratorService.getImagesHistoryList(
        workspaceObjectId,
        userObjectId,
        page,
        limit
      );
      
      if (result.success) {
        return res.apiSuccess(result.data, result.message);
      } else {
        return res.apiError(result.message, 400);
      }
    } catch (error) {
      console.error('Error in getArtHistory controller:', error);
      return res.apiError(error instanceof Error ? error.message : 'Internal server error', 500);
    }
  },
};

// Default export for the controller
export default aiToolsController;