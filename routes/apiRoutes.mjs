import { Router } from 'express';
import { authenticationController } from '../controllers/authenticationController.mjs';

const router = Router();

router.get("/", authenticationController.authGoogle);

export default router;