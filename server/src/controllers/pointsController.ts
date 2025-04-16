import { Request, Response } from 'express';
import { CustomerPoints } from '../models/CustomerPoints';

export const getPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== 'customer') {
      res.status(403).json({ error: 'Only customers can view points' });
      return;
    }

    let customerPoints = await CustomerPoints.findOne({ where: { user_id: user.id } });
    if (!customerPoints) {
      customerPoints = await CustomerPoints.create({ user_id: user.id, points: 0 } as any);
    }

    res.json({ points: customerPoints.points });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch points', details: (err as Error).message });
  }
};
