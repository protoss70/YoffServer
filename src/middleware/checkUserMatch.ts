import { Request, Response, NextFunction } from 'express';
import User from '../models/User'; // Adjust the path to your User model

// Middleware to check if token email matches user email from the database
export const checkUserMatch = async (req: Request, res: Response, next: NextFunction) => {
  console.log("USER MATCH CHECK");

  const tokenEmail = res.locals.user?.email; // Get email from decoded token
  const userId = req.body.userId; // Get userId from req.body.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch the user from the database using the userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the token email matches the user's email
    if (tokenEmail !== user.email) {
      console.log("Mismatched emails (token, user): ", tokenEmail, user.email);
      return res.status(403).json({ message: 'User mismatch: Unauthorized action' });
    }

    res.locals.userData = user;

    next(); // Proceed to the next middleware/route handler if emails match
  } catch (error) {
    console.error('Error checking user match:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};