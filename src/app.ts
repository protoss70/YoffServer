import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Simple test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to my TypeScript REST API' });
});

export default app;
