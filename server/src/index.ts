import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db'; // Adjust based on your project structure
import authRoutes from './routes/authRoutes';
import restaurantRoutes from './routes/restaurantRoutes'; // Assuming you have restaurantRoutes defined
import menuRoutes from './routes/menuRoutes'; // Assuming you have menuRoutes defined

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Replate backend is live');
});

// Mount the auth routes under the /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes); // Assuming you have menu routes defined

// Initialize Sequelize and then start the server
sequelize
  .sync() // Optionally use { alter: true } in development
  .then(() => {
    console.log('✅ Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('❌ Error syncing database:', error);
  });
