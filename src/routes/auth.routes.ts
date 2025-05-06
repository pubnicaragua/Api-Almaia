import express from 'express';
import { sessionAuth } from '../middleware/supabaseMidleware';
import { AuthService } from '../infrestructure/server/auth/AuthService';
const router = express.Router();

router.post('/', sessionAuth, AuthService.login);
router.post('/', sessionAuth, AuthService.register);
router.post('/', sessionAuth, AuthService.changePassword);
export default router;