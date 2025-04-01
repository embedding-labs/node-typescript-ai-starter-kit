import mongoose from 'mongoose';
import GenerationRecord from '../../models/generation-record.model';
import { IAIModel, ImageGenerationRequest, Size } from '../../interfaces/ai-tools.interface';
import Workspace from '../../models/workspace.model';
import User from '../../models/user.model';
import awsUtils from '../../utils/aws.utils';
import analyticsUtil from '../../utils/analytics.util';
import replicateUtils from '../../utils/replicate.utils';
import { GENERAL_SIZES } from '../../constants/tools.constants';

// =============== PUBLIC SERVICE FUNCTIONS ===============

/**
 * Public service object with exported functions
 */
const imageGeneratorService = {
  /**
   * Generate images based on the provided prompt
   * @param userId - User ID who is generating the image
   * @param workspaceId - Workspace ID where the image is being generated
   * @param data - Image generation request data
   * @returns Generated images information
   */
  generateImage: async (
    userId: mongoose.Types.ObjectId,
    workspaceId: mongoose.Types.ObjectId, 
    data: ImageGenerationRequest
  ) => {
    try {
      const { textPrompt, sizeCode, noOfImages } = data;
     

      // TODO: Add prompt template
      const promptTemplate = '{{TEXT_PROMPT}}';
        
      // Format the prompt according to the template
      const formattedPrompt = promptTemplate.replace('{{TEXT_PROMPT}}', textPrompt);
        
      // Find the size configuration
      const size = getSingleSizeDetailById(sizeCode);

      const workspace = await Workspace.findOne({_id: workspaceId}, {aiCredits: 1});
      const user = await User.findOne({_id: userId}, {name: 1, profilePic: 1, handle: 1});

      if(workspace && workspace.aiCredits < (1 * noOfImages)) {
        return {
          success: false, 
          message: 'AI Credits not available'
        };
      }
      
      const { generatedImages, aiCreditsUsed } = await generateAIImagesFromNewPrompt({
        formattedPrompt, 
        noOfImages, 
        size, 
        workspaceId
      });
      if(generatedImages.length == 0){
        return {
          success: false,
          message: 'Failed to generate images'
        };
      }
      // Create a new generation record
      const generationRecord = new GenerationRecord({
        generationName: `Image generation: ${textPrompt.substring(0, 30)}...`,
        sizeId: sizeCode,
        width: size.width,
        height: size.height,
        promptText: textPrompt,
        workspaceId,
        userId,
        userInfo: {
          name: user?.name,
          profilePic: user?.profilePic,
          handle: user?.handle
        },
        generatedImages: generatedImages,
        generationCost: aiCreditsUsed
      });
      console.log("generationRecord", generationRecord);
      
      await generationRecord.save();
      const newImages = getSingleRequestAIImageObj(generationRecord);
      
      // Track image generation event
      analyticsUtil.trackEvents({
        userId: userId.toString(),
        eventName: 'Image Generated',
        properties: {
          workspaceId: workspaceId.toString(),
          sizeCode: sizeCode,
          noOfImages: noOfImages,
          aiCreditsUsed: aiCreditsUsed,
          generationRecordId: generationRecord._id.toString()
        }
      });
        
      // Respond with the generated images
      return {
        success: true, 
        message: 'Images generated successfully', 
        data: { newImages }
      };
    } catch (error) {
      console.error('Error generating images:', error);
      return {
        success: false,
        message: 'Failed to generate images'
      };
    }
  },

  /**
   * Get art history list with pagination
   * @param workspaceId - The ID of the workspace
   * @param userId - The ID of the user
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns List of previous art generation records
   */
  getImagesHistoryList: async (
    workspaceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const skip = (page - 1) * limit;
      
      // Query generation records for this workspace
      const records = await GenerationRecord.find({
        workspaceId
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
      console.log("records", records);
      // Count total documents for pagination
      const totalRecords = await GenerationRecord.countDocuments({
        workspaceId,
      });
      
      // Format records using the helper function
      const formattedRecords = records.map(record => getSingleRequestAIImageObj(record));
      
      // Calculate pagination data
      const totalPages = Math.ceil(totalRecords / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      
      return {
        success: true,
        message: 'Art history retrieved successfully',
        data: {
          records: formattedRecords,
          pagination: {
            totalRecords,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPrevPage,
            limit
          }
        }
      };
    } catch (error) {
      console.error('Error retrieving art history:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve art history'
      };
    }
  },

};



// =============== PRIVATE HELPER FUNCTIONS ===============

/**
 * Prepare and process AI image generation 
 * @private
 */
const generateAIImagesFromNewPrompt = async ({
  formattedPrompt, 
  noOfImages, 
  size, 
  workspaceId
}: {
  formattedPrompt: string;
  noOfImages: number;
  size: Size;
  workspaceId: mongoose.Types.ObjectId;
}) => {
  const generatedImages = await generateImageByFluxReplicate({
    replicateModelId: 'black-forest-labs/flux-dev-lora',
    promptForAI: formattedPrompt,
    aspectRatio: size.aspectRatio,
    noOfImages, 
    workspaceId,
  });

  const aiCreditsUsed = 1 * generatedImages.length;
  return { generatedImages, aiCreditsUsed };
};

/**
 * Generate images with Replicate's Flux AI
 * @private
 */
const generateImageByFluxReplicate = async({
  replicateModelId, 
  promptForAI, 
  aspectRatio, 
  noOfImages, 
  workspaceId
}: {
  replicateModelId: string;
  promptForAI: string;
  aspectRatio: string;
  noOfImages: number | string;
  workspaceId: mongoose.Types.ObjectId;
}) => {
  let images = [];
  const output = await replicateUtils.runModel(
    replicateModelId,
    {
      prompt: promptForAI,
      go_fast: true,
      megapixels: "1",
      num_outputs: typeof noOfImages === 'string' ? parseInt(noOfImages) : noOfImages,
      aspect_ratio: aspectRatio,
      output_format: "png",
      output_quality: 80,
    }
  );
    
  // Ensure output is an array
  const outputArray = Array.isArray(output) ? output : [output];
  
  for(let i=0; i < outputArray.length; i++){
    let s3ImageObj = await awsUtils.uploadReplicateStreamToS3({
      workspaceId: workspaceId.toString(), 
      output: outputArray[i], 
      uniqueSlug: i
    });
    if(s3ImageObj){
      images.push(s3ImageObj);
    }
  }
  return images;
};

/**
 * Format generation record into a simplified object for API response
 * @private
 */
const getSingleRequestAIImageObj = (generationRecord: any) => {
  return {
    generationRecordId: generationRecord._id,
    images: generationRecord.generatedImages.map((img: any) => ({
      imageUrl: img.imageUrl,
      imageId: img._id,
      feedback : img.feedback
    })),
    prompt: generationRecord.promptText,
    createdAt: generationRecord.createdAt
  };
};

const getSingleSizeDetailById = (sizeCode: string) => {
  const size = GENERAL_SIZES.find((size: Size) => size.sizeId === sizeCode);
  if(size){
    return size;
  }  
  return {
    sizeId: "square",
    name: "Square",
    description: "1024x1024",
    width: 1024,
    height: 1024,
    aspectRatio: "1:1",
    imageUrl: ""
  };
}

// Default export for the service
export default imageGeneratorService;
