import { Router } from 'express';
import { postWebhook } from '../controllers/webhookController';

const webhookRoutes = Router();

webhookRoutes.post('/postwebhook', postWebhook);

export default webhookRoutes;
