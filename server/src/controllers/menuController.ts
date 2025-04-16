import { Request, Response } from 'express';
import { MenuItem } from '../models/MenuItem';

// POST /menu
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Error creating item', details: (err as Error).message });
  }
};

// PUT /menu/:id
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await MenuItem.findByPk(req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
  
      await item.update(req.body);
      res.status(200).json(item);
    } catch (err) {
      res.status(400).json({ error: 'Error updating item', details: (err as Error).message });
    }
  };
  
// DELETE /menu/:id
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await MenuItem.findByPk(req.params.id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
  
      await item.destroy();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Error deleting item', details: (err as Error).message });
    }
  };
  

// GET /menu/:businessId
export const getMenuItemsByBusiness = async (req: Request, res: Response) => {
  try {
    const items = await MenuItem.findAll({
      where: { business_id: req.params.businessId }
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items', details: (err as Error).message });
  }
};
