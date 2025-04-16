import { Request, Response } from 'express';
import { MenuItem } from '../models/MenuItem';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { OrderStatus } from '../models/OrderStatus';
import { Business } from '../models/Business';
import { CustomerPoints } from '../models/CustomerPoints';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (user.role !== 'customer') {
        res.status(403).json({ error: 'Only customers can place orders' });
        return;
      }
  
      const { items, businessId } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Order must include items.' });
        return;
      }
  
      const business = await Business.findByPk(businessId);
      if (!business) {
        res.status(404).json({ error: 'Business not found' });
        return;
      }
  
      let totalPrice = 0;
      const orderItems = [];
  
      for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.menuItemId);
        if (!menuItem) {
          res.status(404).json({ error: `Menu item with ID ${item.menuItemId} not found` });
          return;
        }
  
        if (menuItem.business_id !== businessId) {
          res.status(400).json({
            error: `Menu item ID ${item.menuItemId} does not belong to business ID ${businessId}`
          });
          return;
        }
  
        const itemTotal = menuItem.price * item.quantity;
        totalPrice += itemTotal;
  
        orderItems.push({
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
        });
      }
  
      const order = await Order.create({
        user_id: user.id,
        business_id: businessId,
        status_id: 1, // pending
        total_price: totalPrice,
      } as any);
  
      for (const item of orderItems) {
        await OrderItem.create({
          order_id: order.id,
          ...item,
        } as any);
      }
  
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create order', details: (err as Error).message });
    }
  };
  
  

export const getCustomerOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== 'customer') {
      res.status(403).json({ error: 'Only customers can view their orders' });
      return;
    }

    const orders = await Order.findAll({
      where: { user_id: user.id },
      include: [OrderItem, OrderStatus],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: (err as Error).message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const order = await Order.findByPk(req.params.id, {
      include: [OrderItem, OrderStatus],
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const business = await Business.findByPk(order.business_id);
    const isCustomer = order.user_id === +user.id;
    const isBusinessOwner = business?.user_id === +user.id;

    if (!isCustomer && !isBusinessOwner) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order', details: (err as Error).message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== 'business') {
      res.status(403).json({ error: 'Only businesses can update order status' });
      return;
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const business = await Business.findByPk(order.business_id);
    if (business?.user_id !== +user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { statusId } = req.body;
    order.status_id = statusId;
    await order.save();

    if (statusId === 3) {
        const customerId = order.user_id;
        const pointsToAdd = Math.floor(Number(order.total_price)); // 1 point per $1
        let customerPoints = await CustomerPoints.findOne({ where: { user_id: customerId } });
      
        if (customerPoints) {
          customerPoints.points += pointsToAdd;
          customerPoints.lastUpdated = new Date();
          await customerPoints.save();
        } else {
          await CustomerPoints.create({
            user_id: customerId,
            points: pointsToAdd,
          } as any);
        }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status', details: (err as Error).message });
  }
};

export const getRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== 'business') {
      res.status(403).json({ error: 'Only businesses can view restaurant orders' });
      return;
    }

    const business = await Business.findByPk(req.params.id);
    if (!business || business.user_id !== +user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const orders = await Order.findAll({
      where: { business_id: req.params.id },
      include: [OrderItem, OrderStatus],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurant orders', details: (err as Error).message });
  }
};
