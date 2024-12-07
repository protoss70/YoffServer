"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailVerified = void 0;
const isEmailVerified = (req, res, next) => {
    const user = res.locals.userData;
    if (!user) {
        return res.status(401).json({ message: 'User not found in request context.' });
    }
    if (!user.emailVerified) {
        return res.status(403).json({ message: 'Email is not verified. Please verify your email to continue.' });
    }
    next();
};
exports.isEmailVerified = isEmailVerified;
