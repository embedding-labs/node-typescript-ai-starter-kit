// interfaces/workspace-member.interface.ts

import { Document, Types } from 'mongoose';

export interface IWorkspaceMember extends Document {
  userName: string;
  workspaceId: Types.ObjectId | null;
  workspaceName: string;
  userId: Types.ObjectId | null;
  permission: 'OWNER' | 'ADMIN' | 'EDITOR'; 
  status: 'INVITED' | 'JOINED';
  createdAt: Date;
  invitedBy: Types.ObjectId | null;
  updatedAt: Date;
}