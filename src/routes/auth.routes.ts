import { login } from '@controllers/index';
import { Router } from 'express';

const router = Router();

router.post('/login', login);


export default router;