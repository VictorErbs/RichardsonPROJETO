import { Router } from 'express';
import { trackClick, trackSubmission, trackEmailOpen } from '../controllers/tracking.controller';

const router = Router();

// Public routes (não requerem autenticação - são chamadas pelos links nos e-mails)
router.get('/click/:emailLogId', trackClick);
router.get('/open/:emailLogId', trackEmailOpen);
router.post('/submit/:campaignId', trackSubmission);

export default router;
