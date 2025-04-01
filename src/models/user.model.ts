// models/user.model.ts

import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    default: "" 
  },
  handle: { 
    type: String, 
    default: "" 
  },
  emailId: { 
    type: String, 
    default: "",
    index: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  profilePic: { 
    type: String, 
    default: "" 
  },
  password: { 
    type: String, 
    default: "" 
  },
  googleId: { 
    type: String, 
    default: null 
  },
  onboardingCompleted: { 
    type: Boolean, 
    default: false 
  },
  googleResponse: { 
    type: Object, 
    default: {} 
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
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to update the updatedAt field on updateOne/updateMany
UserSchema.pre(['updateOne', 'updateMany'], function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

// Middleware to update the updatedAt field on findOneAndUpdate
UserSchema.pre('findOneAndUpdate', function(this: mongoose.Query<any, any>) {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model<IUser>('User', UserSchema);