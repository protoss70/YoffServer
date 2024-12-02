"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User")); // Adjust the import path as needed
const dates_1 = require("../utility/dates");
const router = express_1.default.Router();
// Find or Create User Route
router.post('/findOrCreate', async (req, res) => {
    const email = res.locals.user?.email;
    const emailVerified = res.locals.user?.email_verified;
    const { timezone, fullName: bodyFullName } = req.body; // Extract timezone and fullName from request body
    const fullName = bodyFullName || res.locals.user?.name; // Prioritize fullName from request body over Firebase
    if (!email) {
        console.error('No email found in res.locals.user');
        return res.status(400).json({ success: false, message: 'Email not found in request' });
    }
    if (!timezone) {
        console.error('No timezone found in request body');
        return res.status(400).json({ success: false, message: 'Timezone is required' });
    }
    // Check if timezone is valid
    if (!(0, dates_1.isValidGMTOffset)(timezone)) {
        console.error('Invalid timezone:', timezone);
        return res.status(400).json({ success: false, message: 'Invalid timezone provided' });
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
                timezone, // Add timezone to the new user document
                fullName: fullName || undefined, // Set fullName from body or Firebase if provided
            });
            console.log('Newly created user:', user);
        }
        else {
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
