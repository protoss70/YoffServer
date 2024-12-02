"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Payment_1 = __importDefault(require("../models/Payment")); // Adjust the import path
const isAdmin_1 = __importDefault(require("../middleware/isAdmin"));
const isAuth_1 = require("../middleware/isAuth");
const checkUserMatch_1 = require("../middleware/checkUserMatch");
const emailTemplates_1 = require("../services/mail/emailTemplates");
const router = express_1.default.Router();
// TODO after creating a payment system, add strict validation
router.get("/inform-support-payment", isAuth_1.isAuth, checkUserMatch_1.checkUserMatch, async (req, res) => {
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
        await (0, emailTemplates_1.paymentAwaitingProcessing)({
            studentFullName: userFullName,
            studentEmail: email,
            plan, // Safely pass the plan here as it is now guaranteed to be a string
        });
        return res.status(200).json({
            success: true,
            message: "Information email sent!",
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Create a Payment
router.post('/', isAdmin_1.default, async (req, res) => {
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
        const payment = await Payment_1.default.create({
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
