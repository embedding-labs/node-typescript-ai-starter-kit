import { Request, Response } from 'express';
import publicService from '../services/public.service';



export const uploadImageToS3 = async (req: Request, res: Response): Promise<any> => {
  try {
    // Extract necessary data from the request
    const file = req.files?.file as {data: Buffer; name: string;};
    
    if (!file) {
      return res.apiError('No file uploaded', 400);
    }
    
    // Get workspaceId from query params or use default
    const workspaceId = (req.body.workspaceObjectId as string) || 'public';
    
    // Create the upload parameters object
    const uploadParams: any = {
      fileData: file.data,
      fileName: file.name,
      workspaceId
    };
    
    // Pass only the necessary data to the service
    const result = await publicService.uploadImageToS3(uploadParams);
    console.log(result);
    return res.apiSuccess(result);
  } catch (error) {
    console.error('Error in upload image to s3 controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
};







export const checkApi = async (req: Request, res: Response): Promise<any> => {
  try {
    
              return res.apiSuccess("Public API is working");
  } catch (error) {
    console.error('Error in update model controller:', error);
    return res.apiError('Something went wrong! Please contact your admin', 500);
  }
}

