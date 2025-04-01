import Replicate from 'replicate';

/**
 * Singleton instance of Replicate client for global use across the application
 */
const replicateInstance = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

/**
 * Utility functions for interacting with Replicate API
 */
const replicateUtils = {
  /**
   * Get the singleton Replicate client instance
   * @returns Replicate client instance
   */
  getClient: () => replicateInstance,
  
  /**
   * Run a model on Replicate with the given inputs
   * @param modelId - The model ID in 'owner/model' or 'owner/model:version' format
   * @param input - The input parameters for the model
   * @returns The output from the model
   */
  runModel: async (modelId: string, input: any) => {
    // Ensure model ID is in the correct format
    const formattedModelId = modelId.includes('/') 
      ? modelId as `${string}/${string}` 
      : `stability-ai/${modelId}` as `${string}/${string}`;
    
    return await replicateInstance.run(formattedModelId, {
      input
    });
  }
};

export default replicateUtils; 