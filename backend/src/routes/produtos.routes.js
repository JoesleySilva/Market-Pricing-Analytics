import { Router } from 'express';
import * as controller from '../controllers/produtos.controller.js';

const router = Router();

router.get('/', controller.listar);
router.post('/', controller.criar);
router.delete('/:id', controller.deletar);

export default router;
