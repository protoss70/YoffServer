"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User")); // Adjust the import path as needed
const router = express_1.default.Router();
// Find or Create User Route
router.post('/findOrCreate', async (req, res) => {
    const email = res.locals.user?.email;
    const emailVerified = res.locals.user?.email_verified;
    if (!email) {
        console.error('No email found in res.locals.user');
        return res.status(400).json({ success: false, message: 'Email not found in request' });
    }
    try {
        // Check if the user exists
        let user = await User_1.default.findOne({ email });
        if (!user) {
            console.log('User not found, creating new user...');
            user = await User_1.default.create({
                email,
                credits: 0,
                emailVerified: emailVerified || false,
                demoClass: undefined, // Assuming demoClass can be undefined
            });
            console.log('Newly created user:', user);
        }
        // Respond with the user data
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error('Error finding or creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
