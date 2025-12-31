import { login } from '@controllers/authController';
import { Router } from 'express';

const router = Router();

router.post('/login', login);


export default router;