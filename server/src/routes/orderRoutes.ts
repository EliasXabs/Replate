import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus,
  getRestaurantOrders,
} from '../controllers/orderController';

const router = Router();

router.post('/', authMiddleware, createOrder); // customer
router.get('/', authMiddleware, getCustomerOrders); // customer
router.get('/:id', authMiddleware, getOrderById); // customer + business
router.put('/:id/status', authMiddleware, updateOrderStatus); // business
router.get('/restaurant/:id', authMiddleware, getRestaurantOrders); // business

export default router;
