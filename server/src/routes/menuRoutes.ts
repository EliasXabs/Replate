import { Router } from 'express';
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByBusiness
} from '../controllers/menuController';
import authMiddleware from '../middlewares/authMiddleware';
import { checkBusinessOwnership } from '../middlewares/ownershipMiddleware';

const router = Router();

// Protected
router.post('/', authMiddleware, checkBusinessOwnership, createMenuItem);
router.put('/:id', authMiddleware, checkBusinessOwnership, updateMenuItem);
router.delete('/:id', authMiddleware, checkBusinessOwnership, deleteMenuItem);

// Public
router.get('/:businessId', getMenuItemsByBusiness);

export default router;
