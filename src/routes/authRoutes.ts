import { Router } from 'express';
import { isAuth } from '../middleware/is-auth';  // Import your authentication middleware

const router = Router();

// Example protected route
router.get('/is-auth', isAuth);

export default router;
