import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors" // Import cors middleware
import userRoutes from './routes/userRoutes';
import scheduledClassRoutes from './routes/scheduleClassRoute';
import paymentRoutes from './routes/paymentRoutes';
import teacherRoutes from './routes/teacherRoute';
import { isAuth } from './middleware/isAuth';
import { checkUserMatch } from './middleware/checkUserMatch';

dotenv.config();

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: ['https://yoff.academy', 'http://localhost:8080'], // Allow these origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow credentials
};

// Enable CORS with specified options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Default route for "/"
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to my TypeScript REST API' });
});

// Use user routes
app.use('/api/users', isAuth, userRoutes);

// Use scheduled class routes
app.use('/api/scheduledClasses', isAuth, checkUserMatch, scheduledClassRoutes);

// Use payment routes
app.use('/api/payments', isAuth, checkUserMatch, paymentRoutes);

// Teacher routes without auth
app.use('/api/teacher', teacherRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
