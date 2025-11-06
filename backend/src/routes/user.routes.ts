import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { getAllUsers, getUserStats, getRanking } from '../controllers/user.controller';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/stats/:userId', authMiddleware, getUserStats);
router.get('/ranking', authMiddleware, getRanking);

export default router;
