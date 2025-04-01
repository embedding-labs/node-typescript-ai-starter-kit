import { Request, Response } from 'express';
import workspaceService from '../services/workspace.service';
import { AuthenticatedRequest } from '../interfaces/request.interface';

/**
 * Get workspace home data
 * @param req Request with workspaceId in query
 * @param res Response object
 */
export const home = async (req: Request, res: Response): Promise<any> => {
  try {
    const workspaceId = req.query.workspaceId as string;
    const userId = req.user?.userId;
    
   
    const result = await workspaceService.home(workspaceId, userId);
    
    if (!result.success) {
      return res.apiError(result.message, 400);
    }    
    return res.apiSuccess(result.data, 'Workspace home data retrieved successfully');
  } catch (error) {
    console.error('Error in workspace home controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};

export const checkUserAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) {
      return res.apiError('Unauthorized', 401);
    }
    return res.apiSuccess({ userId }, 'User authenticated successfully');
  } catch (error) {
    console.error('Error in workspace checkUserAuth controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};
