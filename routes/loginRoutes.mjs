import { Router } from 'express';
import { authenticationController } from '../controllers/authenticationController.mjs';

const router = Router();

router.post("/", authenticationController.auth);
router.get("/google", authenticationController.authGoogle);
router.post("/register", authenticationController.register);

export default router;
