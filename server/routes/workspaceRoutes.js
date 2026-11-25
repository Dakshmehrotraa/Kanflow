import { Router } from 'express';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
} from '../controllers/workspaceController.js';
import {
  getCards,
  createCard,
  updateCard,
  moveCard,
  deleteCard,
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { workspaceAccess } from '../middleware/workspaceAccess.js';

const router = Router();

// Every workspace route requires a valid token.
router.use(protect);

// Collection
router.route('/').get(getWorkspaces).post(createWorkspace);

// Single workspace — access + role enforced per verb
router.get('/:id', workspaceAccess('viewer'), getWorkspace);
router.patch('/:id', workspaceAccess('editor'), updateWorkspace);
router.delete('/:id', workspaceAccess('owner'), deleteWorkspace);
router.post('/:id/members', workspaceAccess('owner'), addMember);

// Nested card routes (scoped + isolated to the workspace)
router.get('/:workspaceId/cards', workspaceAccess('viewer'), getCards);
router.post('/:workspaceId/cards', workspaceAccess('editor'), createCard);
router.patch('/:workspaceId/cards/:cardId', workspaceAccess('editor'), updateCard);
router.patch('/:workspaceId/cards/:cardId/move', workspaceAccess('editor'), moveCard);
router.delete('/:workspaceId/cards/:cardId', workspaceAccess('editor'), deleteCard);

export default router;
