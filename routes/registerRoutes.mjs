import {Router} from 'express';
import {authenticationController} from '../controllers/authenticationController.mjs';

const router = Router();

router.post('/', authenticationController.register);

export default router;