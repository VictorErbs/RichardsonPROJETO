import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendCampaignEmails,
  sendCampaignOnce
} from '../controllers/campaign.controller';

const router = Router();

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createCampaign);
router.get('/', authMiddleware, getAllCampaigns);
router.get('/:id', authMiddleware, getCampaignById);
router.put('/:id', authMiddleware, adminMiddleware, updateCampaign);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCampaign);
router.post('/:id/send', authMiddleware, adminMiddleware, sendCampaignEmails);
router.post('/:id/send-once', authMiddleware, adminMiddleware, sendCampaignOnce);

export default router;
