import express from 'express';
import { getPurchaseStatus } from '../controllers/purchaseStatus.controller';
import { isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

router.get('/',isAuthenticatedUser, getPurchaseStatus);

export default router;
