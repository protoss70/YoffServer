import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import connectDB from './database/db'; // Import the connectDB function

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// Use authentication routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});