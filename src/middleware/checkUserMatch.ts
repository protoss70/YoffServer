import { Request, Response, NextFunction } from 'express';

// Middleware to check if token email matches req.body.userData.email
export const checkUserMatch = (req: Request, res: Response, next: NextFunction) => {
  const tokenEmail = res.locals.user?.email; // Get email from decoded token
  const requestEmail = req.body.userData?.email; // Get email from req.body.userData.email

  if (!tokenEmail || !requestEmail || tokenEmail !== requestEmail) {
    return res.status(403).json({ message: 'User mismatch: Unauthorized action' });
  }

  next();
};