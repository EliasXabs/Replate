import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Public endpoints: list restaurants and get details of a restaurant
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantDetail);

// Restricted endpoints: these require the user to be authenticated
router.post('/', authMiddleware, restaurantController.createRestaurant);
router.delete('/:id', authMiddleware, restaurantController.deleteRestaurant);

export default router;
