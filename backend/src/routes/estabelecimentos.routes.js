import { Router } from 'express';
import {   criar,   listar } from '../controllers/estabelecimentos.controller.js';

const router = Router();

router.get('/', listar);
router.post('/', criar);

export default router;
