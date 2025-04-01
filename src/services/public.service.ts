// services/public.service.ts

import { Request } from 'express';
import { GENERAL_SIZES } from '../constants/tools.constants';
import awsUtils from '../utils/aws.utils';


// -------------------------------------------------------------------------
// PUBLIC FUNCTIONS
// -------------------------------------------------------------------------

/**
 * Get background remover settings
 * @returns Background remover settings data
 */
const bgRemoverSettings = async() => {
    const normalRemoverCredits = 0;
    const advancedRemoverCredits = 4;
    return { normalRemoverCredits, advancedRemoverCredits };
};


const uploadImageToS3 = async(uploadParams: any) => {
    try {
        const result = await awsUtils.uploadSingleFileToS3(uploadParams);
        return result;
    } catch (error) {
        console.error("Error uploading image to S3:", error);
    }
};
// -------------------------------------------------------------------------
// PRIVATE FUNCTIONS
// -------------------------------------------------------------------------


// -------------------------------------------------------------------------
// EXPORT PUBLIC INTERFACE
// -------------------------------------------------------------------------

/**
 * Public service for AI tools settings
 */
export const publicService = {
    bgRemoverSettings,
    uploadImageToS3
};

// Export the service as default export
export default publicService; 