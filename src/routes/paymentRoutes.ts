import express, { Request, Response } from 'express';
import Payment, { IPayment } from '../models/Payment'; // Adjust the import path

const router = express.Router();

// TODO after creating a payment system, add strict validation

// Create a Payment
router.post('/', async (req: Request, res: Response) => {
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