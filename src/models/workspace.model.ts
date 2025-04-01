// models/workspace.model.ts

import mongoose, { Schema } from 'mongoose';
import { IWorkspace } from '../interfaces/workspace.interface';

const WorkspaceSchema: Schema = new Schema({
  name: { 
    type: String, 
    default: "",
    required: true 
  },
  teamSize: { 
    type: String, 
    default: "" 
  },
  workspaceType: { 
    type: String, 
    default: "personal" 
  },
  aiCredits: { 
    type: Number, 
    default: 0 
  },
  maximumCredits: { 
    type: Number, 
    default: 0 
  },
  logo: { 
    type: String, 
    default: "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4" 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    default: null
  },
  planType: { 
    type: String, 
    default: "free" 
  },
  subscriptionStatus: { 
    type: String, 
    default: "inactive" 
  },  // BILLING_STATUS
  stripeSubscriptionId: { 
    type: String, 
    default: null 
  },  
  subscriptionInterval: { 
    type: String, 
    enum: ['monthly', 'yearly'], 
    default: 'monthly'
  }, // BILLING_INTERVAL
  stripeCustomerId: { 
    type: String, 
    default: null 
  },  
  subscriptionPeriodStartDate: { 
    type: Date, 
    default: Date.now 
  },
  subscriptionPeriodEndDate: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to update the updatedAt field on save
WorkspaceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to update the updatedAt field on updateOne/updateMany
WorkspaceSchema.pre(['updateOne', 'updateMany'], function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

// Middleware to update the updatedAt field on findOneAndUpdate
WorkspaceSchema.pre('findOneAndUpdate', function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);