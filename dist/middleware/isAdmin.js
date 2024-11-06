"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
function isAdmin(req, res, next) {
    const adminUsername = req.headers['x-admin-username'];
    const adminPassword = req.headers['x-admin-password'];
    // Check if credentials match those in environment variables
    if (adminUsername === process.env.ADMIN_USERNAME &&
        adminPassword === process.env.ADMIN_PASSWORD) {
        return next(); // Credentials are correct, proceed to next middleware or route
    }
    // If credentials don't match, return a 401 Unauthorized response
    res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
}
exports.default = isAdmin;
