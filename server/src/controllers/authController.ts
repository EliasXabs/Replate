import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { generateJWT } from '../services/authServices';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create a new user record
    const user = await User.create({ name, email, password_hash, role });
    
    // Convert the Sequelize instance to a plain object and remove password_hash
    const userWithoutPassword = user.toJSON();
    delete (userWithoutPassword as { password_hash?: string }).password_hash;
    
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }
    
    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }
    
    // Generate a JWT token using generateJWT (convert user.id to string)
    const token = generateJWT(String(user.id), { role: user.role });
    
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
};
