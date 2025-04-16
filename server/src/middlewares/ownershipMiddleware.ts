import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../models/MenuItem';
import { Business } from '../models/Business';

export const checkBusinessOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let businessId: number;

    if (req.method === 'POST') {
      businessId = req.body.business_id;
    } else {
      const item = await MenuItem.findByPk(req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      businessId = item.business_id;
    }

    const business = await Business.findByPk(businessId);
    if (!business) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    const user = (req as any).user;
    if (business.user_id !== parseInt(user?.id || '', 10)) {
      res.status(403).json({ error: 'Forbidden: Not your business' });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: (err as Error).message });
  }
};
