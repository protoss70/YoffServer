"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const firebaseConfig_1 = __importDefault(require("../firebaseConfig")); // Import Firebase Admin SDK
// Middleware to check Firebase ID token
const isAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header (Bearer <token>)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken = await firebaseConfig_1.default.auth().verifyIdToken(token);
        res.locals.user = decodedToken; // Attach decoded user info to the request object
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
exports.isAuth = isAuth;
