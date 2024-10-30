import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import scheduledClassRoutes from './routes/ScheduleClassRoute';
import paymentRoutes from './routes/paymentRoutes'; // Import payment routes
import { isAuth } from './middleware/isAuth';

dotenv.config();

const app = express();

app.use(express.json());

// Use user routes
app.use('/api/users', isAuth, userRoutes);

// Use scheduled class routes
app.use('/api/scheduledClasses', isAuth, scheduledClassRoutes);

// Use payment routes
app.use('/api/payments', isAuth, paymentRoutes); // Base path for payment routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});