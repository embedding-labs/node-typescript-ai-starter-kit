import { Router } from 'express';
import userRoutes from './user.routes';
// Import other routes as needed
import workspaceRoutes from './workspace.routes';
import aiToolsRoutes from './ai-tools.routes';
import publicRoutes from './public.routes';

const router = Router();

// Register routes
router.use('/user', userRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/ai-tools', aiToolsRoutes);
router.use('/public', publicRoutes);

export default router; 