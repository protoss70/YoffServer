import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User'; // Update the path as needed

export const isEmailVerified = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser | undefined = res.locals.userData;

  if (!user) {
    return res.status(401).json({ message: 'User not found in request context.' });
  }

  if (!user.emailVerified) {
    return res.status(403).json({ message: 'Email is not verified. Please verify your email to continue.' });
  }

  next();
};