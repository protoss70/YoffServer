"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserMatch = void 0;
const User_1 = __importDefault(require("../models/User")); // Adjust the path to your User model
// Middleware to check if token email matches user email from the database
const checkUserMatch = async (req, res, next) => {
    console.log("USER MATCH CHECK");
    const tokenEmail = res.locals.user?.email; // Get email from decoded token
    const userId = req.body.userId || req.query.userId; // Get userId from req.body or req.query
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        // Fetch the user from the database using the userId
        const user = await User_1.default.findById(userId);
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
    }
    catch (error) {
        console.error('Error checking user match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.checkUserMatch = checkUserMatch;
