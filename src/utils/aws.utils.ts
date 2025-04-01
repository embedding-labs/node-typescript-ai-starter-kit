import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import awsConfig from '../config/aws';

// Initialize S3 client
const s3Client = new S3Client({
    region: awsConfig.region,
    credentials: {
        accessKeyId: awsConfig.accessKeyId || '',
        secretAccessKey: awsConfig.secretAccesskey || ''
    }
});

interface UploadReplicateStreamParams {
    workspaceId: string;
    output: any; // ReadableStream or similar
    uniqueSlug: string | number;
}

interface UploadParams {
    fileData: Buffer;
    fileName: string;
    workspaceId: string;
  }

const awsUtils = {
    uploadReplicateStreamToS3: async({ workspaceId, output, uniqueSlug }: UploadReplicateStreamParams) => {
        try {
            const chunks: Uint8Array[] = [];
            const reader = output.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            const imageBuffer = Buffer.concat(chunks);
            let key = `workspace/${workspaceId}/${new Date().getTime()}${uniqueSlug}.png`;
            const dev = process.env.NODE_ENV !== 'production';
            if(dev) {
                key = `dev/workspace/${workspaceId}/${new Date().getTime()}${uniqueSlug}.png`;
            }

            const uploadParams = {
                Bucket: awsConfig.bucketName || '',
                Key: key,
                Body: imageBuffer
            };
        
            const command = new PutObjectCommand(uploadParams);
            let uploadResult = await s3Client.send(command);
            console.log(uploadResult);
            if(uploadResult){
                const imageUrl = `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;
                return { imageUrl };
            }else{
                return null;
            }
        } catch(e) {
            console.log(e);
            return null;
        }
    },

    uploadSingleFileToS3: async(params : UploadParams) => {
        const { fileData, fileName, workspaceId } = params;
        
        // Generate the key for S3
        let key = `workspace/${workspaceId}/${new Date().getTime()}${fileName}`;
        
        // Check environment and adjust key if needed
        const dev = process.env.NODE_ENV !== 'production';
        if (dev) {
            key = `dev/workspace/${workspaceId}/${new Date().getTime()}${fileName}`;
        }
    console.log(key);
        // Set up S3 parameters
        const s3Params = {
            Bucket: awsConfig.bucketName,
            Key: key,
            Body: fileData
        };
    
        // Upload to S3
        const command = new PutObjectCommand(s3Params);
        await s3Client.send(command);
        
        // Construct and return the URL
        const imageUrl = `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${key}`;
        return { imageUrl };
    }
};

export default awsUtils; 