import mongoose, { Schema } from 'mongoose';
import { IGenerationRecord } from '../interfaces/ai-tools.interface';



const UserInfoSchema = new Schema({
  name: { type: String },
  profilePic: { type: String },
  handle: { type: String }
}, { _id: false });

// Main schema
const GenerationRecordSchema = new Schema({
  // Basic information
  generationName: { type: String, default: "" },
  
  // Size information
  sizeId: { type: String, default: "" },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  
  // Tool and configuration
  generationCount: { type: Number, default: 1 },
  
  promptText: { type: String, default: "" },
  
  // Ownership and references
  workspaceId: { type: Schema.Types.ObjectId, default: null },
  userId: { type: Schema.Types.ObjectId, default: null },
  userInfo: { type: UserInfoSchema },
  
  // Results and history
  generatedImages: { type: [], default: [] },
  
  // Metadata
  isPublic: { type: Boolean, default: false },
  generationCost: { type: Number, default: 1 }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update timestamps
GenerationRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

GenerationRecordSchema.pre('updateOne', function() {
  this.set({ updatedAt: new Date() });
});

GenerationRecordSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model<IGenerationRecord>('GenerationRecord', GenerationRecordSchema);
