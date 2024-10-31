"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Payment_1 = __importDefault(require("../models/Payment")); // Adjust the import path
const router = express_1.default.Router();
// Create a Payment
router.post('/', async (req, res) => {
    const { amount } = req.body; // Extract the amount from the request body
    const user = res.locals.user; // Get the authenticated user from the middleware
    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid amount. Amount must be a positive number.',
        });
    }
    try {
        // Create a new payment record using the user's MongoDB _id
        const payment = await Payment_1.default.create({
            user: user._id, // Use the user's MongoDB ObjectId
            amount,
            paymentDate: new Date(), // Automatically set the current date
            // isPaid will default to false
        });
        // Respond with the created payment
        res.status(201).json({
            success: true,
            payment,
        });
    }
    catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
// Export the router
exports.default = router;
