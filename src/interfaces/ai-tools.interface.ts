import mongoose, { Document } from 'mongoose';





// Main document interface
export interface IAIModel extends Document {
  name: string;
  modelCode?: string;
  modelType: 'IMAGE' | 'TEXT' | 'AUDIO' | 'VIDEO';
  availableSizes: any[];
  // Metadata
  isPublic: boolean;
  sort: number;
  workspaceId?: mongoose.Types.ObjectId | null;
  userId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageGenerationRequest {
  textPrompt: string;
  sizeCode: string;
  noOfImages: number;
}




export interface Size {
  sizeId: string;
  name: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: string;
  imageUrl: string;
}


export interface UserInfo {
  name?: string;
  profilePic?: string;
  handle?: string;
}




export interface IGenerationRecord extends Document {
  generationName: string;
  sizeId: string;
  width: number;
  height: number;
  toolType: 'IMAGE_GENERATOR' | 'UPSCALER' | 'BACKGROUND_REMOVER';
  generationCount: number;
  promptText: string;
  workspaceId: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId | null;
  generatedImages: string[];
  isPublic: boolean;
  generationCost: number;
  createdAt: Date;
  updatedAt: Date;
} 