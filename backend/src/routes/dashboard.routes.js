import { Router } from 'express';
import { resumo } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', resumo);

export default router;
