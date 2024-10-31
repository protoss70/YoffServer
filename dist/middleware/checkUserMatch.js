"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserMatch = void 0;
// Middleware to check if token email matches req.body.userData.email
const checkUserMatch = (req, res, next) => {
    const tokenEmail = res.locals.user?.email; // Get email from decoded token
    const requestEmail = req.body.userData?.email; // Get email from req.body.userData.email
    if (!tokenEmail || !requestEmail || tokenEmail !== requestEmail) {
        return res.status(403).json({ message: 'User mismatch: Unauthorized action' });
    }
    next();
};
exports.checkUserMatch = checkUserMatch;
