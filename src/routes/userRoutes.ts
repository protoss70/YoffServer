import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Adjust the import path as needed

const router = express.Router();

// Find or Create User Route
router.post('/findOrCreate', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    let user: IUser | null = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, create a new user with 0 credits
      user = await User.create({
        email,
        credits: 0,
        emailVerified: false,
        demoClass: undefined, // Assuming demoClass can be undefined
      });
    }

    // Respond with the user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error finding or creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;