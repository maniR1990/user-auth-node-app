import express from 'express';
import { authenticateJWT } from '../lib/middle-ware/authMiddleWare';
import { isSessionAuthenticated } from '../lib/middle-ware/sessionAuthMiddleware';
import {
  registerController,
  loginController,
  testController,
  meController,
  getAllregisteredUserController,
} from '../controller/user.controller';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/test', testController);
router.get('/me', isSessionAuthenticated, meController);
router.get('/allUserDetails', authenticateJWT, getAllregisteredUserController);
export default router;
