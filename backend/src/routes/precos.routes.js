import { Router } from 'express';
import * as controller from '../controllers/precos.controller.js';

const router = Router();

router.post('/', controller.criar);
router.get('/', controller.listar);

export default router;
