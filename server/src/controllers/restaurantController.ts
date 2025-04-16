import { Request, Response } from 'express';
import { Business } from '../models/Business';
import { User } from '../models/User';

// Get all restaurants (public endpoint)
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await Business.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Server error while fetching restaurants' });
  }
};

// Get details for a single restaurant (public endpoint)
export const getRestaurantDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Business.findByPk(restaurantId, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.status(200).json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ error: 'Server error while fetching restaurant details' });
  }
};

// Create a restaurant (restricted to owner users)
export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== 'business') {
      res.status(403).json({ error: 'Forbidden: Only business owners can create restaurants' });
      return;
    }

    const { business_name, address, phone_number } = req.body;
    if (!business_name) {
      res.status(400).json({ error: 'Business name is required' });
      return;
    }

    const restaurant = await Business.create({
      business_name,
      address,
      phone_number,
      user_id: user.id,
    });

    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Server error during restaurant creation' });
  }
};

// Delete a restaurant (restricted to the restaurant owner)
export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
      
      const user = (req as any).user;
      if (!user || user.role !== 'business') {
          res.status(403).json({ error: 'Forbidden: Only business owners can delete restaurants' });
          return;
        }
        
        const restaurantId = req.params.id;
        const restaurant = await Business.findByPk(restaurantId);
        
        if (!restaurant) {
            res.status(404).json({ error: 'Restaurant not found' });
            return;
        }

    if (restaurant.user_id != user.id) {
      res.status(403).json({ error: 'Forbidden: You do not own this restaurant' });
      return;
    }

    await restaurant.destroy();
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Server error while deleting restaurant' });
  }
};
