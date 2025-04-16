import express from 'express';
import { getPoints } from '../controllers/pointsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getPoints);

export default router;
