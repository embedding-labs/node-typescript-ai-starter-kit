// services/workspace.service.ts

import mongoose from 'mongoose';
import User from '../models/user.model';
import Workspace from '../models/workspace.model';
import WorkspaceMember from '../models/workspace-member.model';
import analyticsUtil from '../utils/analytics.util';

// We need to create this model

// Constants
const WORKSPACE_TYPE = {
  PERSONAL: 'personal',
  TEAM: 'team'
};

const MEMBER_STATUS = {
  INVITED: 'invited',
  JOINED: 'joined'
};


// -------------------------------------------------------------------------
// PUBLIC FUNCTIONS
// -------------------------------------------------------------------------

/**
 * Get workspace home data
 * @param workspaceId Optional ID of workspace to load
 * @param userId ID of the current user
 * @param req Original request for tracking purposes
 * @returns Workspace data including user details
 */
async function home(workspaceId: string | undefined, userId: string) {
  try {
    let workspace;
    let currentWorkspaceName = null;
    let currentWorkspaceId = null;
    let currentWorkspaceLogo = null;
    let onboardingCompleted = false;
    let aiCredits = 0;
    let planType = "";
    let planDetails = {};
    
    if (!workspaceId) {
      let personalWorkspace = await Workspace.findOne({ userId, workspaceType: WORKSPACE_TYPE.PERSONAL });
      if (!personalWorkspace) {
        personalWorkspace = await createNewWorkspace({
          userId, 
          workspaceName: "Personal Workspace", 
          teamSize: 1, 
          workspaceType: WORKSPACE_TYPE.PERSONAL
        });
      }
      workspaceId = personalWorkspace.id;
    }
    
    workspace = await Workspace.findOne({ _id: workspaceId });
    let u = await User.findOne({ _id: userId });
    
    if (!u) {
      return { success: false, message: 'User not found' };
    }
    
    onboardingCompleted = u.onboardingCompleted;
    
    if (workspace) {
      currentWorkspaceName = workspace.name;
      currentWorkspaceId = workspace.id;
      currentWorkspaceLogo = workspace.logo;
      aiCredits = (planDetails as any).aiCredits;
      planType = workspace.planType;
      await WorkspaceMember.updateOne(
        { workspaceId: workspace.id, userId: u.id }, 
        { status: MEMBER_STATUS.JOINED }
      );
    }
    
    analyticsUtil.trackEvents({userId, eventName : "Workspace Home Opened", properties : { workspaceId, workspaceName :  currentWorkspaceName}})

    
    return {
      success: true,
      data: {
        name: u.name, 
        avatar: u.profilePic, 
        emailId: u.emailId, 
        aiCredits,
        onboardingCompleted, 
        currentWorkspaceName, 
        currentWorkspaceId, 
        currentWorkspaceLogo, 
        planType
      }
    };
  } catch (error) {
    console.error('Error in workspace home service:', error);
    return { success: false, message: 'Something went wrong!' };
  }
}


// -------------------------------------------------------------------------
// PRIVATE FUNCTIONS
// -------------------------------------------------------------------------


/**
 * Create a new workspace and add the creator as a member
 * @param userId ID of the workspace creator
 * @param workspaceName Name of the workspace
 * @param teamSize Size of the team
 * @param workspaceType Type of workspace (personal or team)
 * @returns The newly created workspace
 */
async function createNewWorkspace({ 
  userId, 
  workspaceName, 
  teamSize, 
  workspaceType 
}: { 
  userId: mongoose.Types.ObjectId | string, 
  workspaceName: string, 
  teamSize: number, 
  workspaceType: string 
}) {
  const workspace = new Workspace({
    name: workspaceName,
    teamSize: teamSize.toString(),
    workspaceType,
    userId
  });
  
  await workspace.save();
  
  // Create workspace member record for the creator
  await new WorkspaceMember({
    userId,
    workspaceId: workspace.id,
    workspaceName,
    permission: 'OWNER',
    status: MEMBER_STATUS.JOINED
  }).save();
  
  return workspace;
}



// -------------------------------------------------------------------------
// EXPORT PUBLIC INTERFACE
// -------------------------------------------------------------------------

/**
 * Workspace service for managing workspaces and their members
 */
export const workspaceService = {
  home
};

// Export the service as default export
export default workspaceService;