import express from 'express';
import { authController } from '../controllers';

const router = express.Router();

router.post('/login', authController.authLogin);
router.post('/refresh-token', authController.generateAccessToken);

export default router;
