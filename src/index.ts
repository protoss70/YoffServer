import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from "cors"; // Import cors middleware
import userRoutes from './routes/userRoutes';
import scheduledClassRoutes from './routes/scheduleClassRoutes';
import paymentRoutes from './routes/paymentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import messageRoutes from './routes/messageRoutes';
import testRoutes from "./routes/testRoutes";
import { isAuth } from './middleware/isAuth';
import { checkUserMatch } from './middleware/checkUserMatch';
import connectDB from './database/db'; // Import your connectDB function

dotenv.config();

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: ['https://yoff.academy', 'http://localhost:5173'], // Allow these origins
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
app.use('/api/users', userRoutes);

// Use scheduled class routes
app.use('/api/scheduleClasses', isAuth, checkUserMatch, scheduledClassRoutes);

// Use payment routes
app.use('/api/payments', paymentRoutes);

// Teacher routes without auth
app.use('/api/teachers', teacherRoutes);

app.use('/api/messages', messageRoutes)

// Middleware to log incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next(); // Call next to proceed to the next middleware or route
});

// Custom Error-Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error message:', err.message); // Log error message
  console.error('Stack trace:', err.stack); // Log stack trace
  res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
});

if (process.env.ENVIRONMENT === "DEVELOPMENT"){
  // Teacher routes without auth
app.use('/api/test', testRoutes);
}

// Connect to the database and then start the server
const PORT = process.env.PORT || 3001;
console.log('Attempting database connection!');
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Port:', process.env.PORT);
connectDB().then(() => {
  console.log('Database connection established');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start the server:', error);
});
