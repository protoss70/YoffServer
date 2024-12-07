import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Adjust the import path as needed
import { isValidGMTOffset } from '../utility/dates';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/mail/emailTemplates';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

// Helper function to generate a unique verification code
const generateVerificationCode = (): string => {
  return crypto.randomBytes(20).toString('hex'); // Generates a random verification code
};

// Find or Create User Route
router.post('/findOrCreate', isAuth, async (req: Request, res: Response) => {
  const email = res.locals.user?.email;
  const emailVerified = res.locals.user?.email_verified;
  const { timezone, fullName: bodyFullName, userLocale } = req.body; // Extract timezone and fullName from request body
  const fullName = bodyFullName || res.locals.user?.name; // Prioritize fullName from request body over Firebase

  console.log("bodyFullname", bodyFullName)
  console.log("locals full name", res.locals.user?.name);
  console.log("user", res.locals.user);

  if (!email) {
    console.error('No email found in res.locals.user');
    return res.status(400).json({ success: false, message: 'Email not found in request' });
  }

  if (!timezone) {
    console.error('No timezone found in request body');
    return res.status(400).json({ success: false, message: 'Timezone is required' });
  }

  // Check if timezone is valid
  if (!isValidGMTOffset(timezone)) {
    console.error('Invalid timezone:', timezone);
    return res.status(400).json({ success: false, message: 'Invalid timezone provided' });
  }

  try {
    // Check if the user exists
    let user: IUser | null = await User.findOne({ email });
    if (!user) {
      console.log('User not found, creating new user...');
      const verificationCode = generateVerificationCode(); // Generate unique verification code
      user = await User.create({
        email,
        credits: 0,
        emailVerified: emailVerified || false,
        demoClass: undefined, // Assuming demoClass can be undefined
        timezone, // Add timezone to the new user document
        fullName: fullName || undefined, // Set fullName from body or Firebase if provided
        verificationCode, // Assign generated code here
      });
      await sendVerificationEmail({email, fullName, verificationCode, userLocale})
      console.log('Newly created user:', user);
    } else {
      // If user exists, update the timezone if it's not set
      if (!user.timezone) {
        user.timezone = timezone;
        await user.save();
        console.log('User timezone updated:', user);
      }

      // Only set fullName if it does not already exist
      if (!user.fullName && fullName) {
        user.fullName = fullName;
        await user.save();
        console.log('User fullName initialized:', user);
      }
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

// Verify Email Route
router.get('/verifyEmail', async (req: Request, res: Response) => {
  const { verificationCode } = req.query; // Extract verificationCode from query params

  if (!verificationCode) {
    return res.status(400).json({
      success: false,
      message: 'Verification code is required.',
    });
  }

  try {
    // Find the user by the verification code
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or verification code is incorrect.',
      });
    }

    // If the verification code matches, set emailVerified to true
    user.emailVerified = true;

    // Update the user by setting emailVerified and removing verificationCode in one operation
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { emailVerified: true },  // Set emailVerified to true
        $unset: { verificationCode: 1 }, // Remove verificationCode
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Email successfully verified.',
      emailVerified: true,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
});


export default router;
