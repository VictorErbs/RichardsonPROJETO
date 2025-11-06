import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { sendTestEmail, verifyEmailProvider } from '../controllers/email.controller';

const router = Router();

router.get('/verify', authMiddleware, adminMiddleware, verifyEmailProvider);
router.post('/test', authMiddleware, adminMiddleware, sendTestEmail);

export default router;
