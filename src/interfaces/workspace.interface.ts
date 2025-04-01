// interfaces/workspace.interface.ts

import { Document, Types } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  teamSize: string;
  workspaceType: string;
  aiCredits: number;
  maximumCredits: number;
  logo: string;
  userId: Types.ObjectId | null;
  planType: string;
  subscriptionStatus: string;
  stripeSubscriptionId: string | null;
  subscriptionInterval: 'MONTHLY' | 'YEARLY';
  stripeCustomerId: string | null;
  subscriptionPeriodStartDate: Date;
  subscriptionPeriodEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}


/**
 * Interface for AI Credit Usage Document
 */
export interface IAICreditUsage extends Document {
  workspaceId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  creditsUsed: number;
  feature: string;
  createdAt: Date;
  updatedAt: Date;
}