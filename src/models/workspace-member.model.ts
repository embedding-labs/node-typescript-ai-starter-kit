// models/workspace-member.model.ts

import mongoose, { Schema } from 'mongoose';
import { IWorkspaceMember } from '../interfaces/workspace-member.interface';

const WorkspaceMemberSchema: Schema = new Schema({
  userName: { 
    type: String, 
    default: "" 
  },
  workspaceId: { 
    type: Schema.Types.ObjectId, 
    default: null
  },
  workspaceName: { 
    type: String, 
    default: "" 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    default: null
  },
  permission: { 
    type: String, 
    default: "owner" 
  }, // OWNER, ADMIN, EDITOR
  status: { 
    type: String, 
    default: "invited" 
  }, // invited, joined
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  invitedBy: { 
    type: Schema.Types.ObjectId, 
    default: null
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to update the updatedAt field on save
WorkspaceMemberSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to update the updatedAt field on updateOne/updateMany
WorkspaceMemberSchema.pre(['updateOne', 'updateMany'], function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

// Middleware to update the updatedAt field on findOneAndUpdate
WorkspaceMemberSchema.pre('findOneAndUpdate', function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model<IWorkspaceMember>('WorkspaceMember', WorkspaceMemberSchema);