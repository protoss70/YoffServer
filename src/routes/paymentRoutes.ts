import express, { Request, Response } from 'express';
import Payment, { IPayment } from '../models/Payment'; // Adjust the import path
import isAdmin from '../middleware/isAdmin';
import { isAuth } from '../middleware/isAuth';
import { checkUserMatch } from '../middleware/checkUserMatch';
import { paymentAwaitingProcessing } from '../services/mail/emailTemplates';
import { IUser } from '../models/User';

const router = express.Router();

// TODO after creating a payment system, add strict validation

router.get("/inform-support-payment", isAuth, checkUserMatch, async (req: Request, res: Response) => {
  try {
    const plan = req.query.plan;
    const userData = res.locals.userData;
    const userFullName = userData.fullName;
    const email = res.locals.user?.email;
    console.log(userFullName, plan, email);

    // Validate that plan is a string
    if (typeof plan !== "string" || !email || !userFullName) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Information!",
      });
    }

    // Call the paymentAwaitingProcessing function with the validated values
    await paymentAwaitingProcessing({
      studentFullName: userFullName,
      studentEmail: email,
      plan, // Safely pass the plan here as it is now guaranteed to be a string
    });

    return res.status(200).json({
      success: true,
      message: "Information email sent!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create a Payment
router.post('/', isAdmin, async (req: Request, res: Response) => {
  const { amount, userId } = req.body; // Extract the amount from the request body

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid amount. Amount must be a positive number.',
    });
  }

  try {
    // Create a new payment record using the user's MongoDB _id
    const payment: IPayment = await Payment.create({
      user: userId, // Use the user's MongoDB ObjectId
      amount,
      paymentDate: new Date(), // Automatically set the current date
      isPaid: true
    });

    // Respond with the created payment
    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Export the router
export default router;