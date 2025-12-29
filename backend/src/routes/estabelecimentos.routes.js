import { Router } from 'express';
import {   criar,   listar, buscarPorId, atualizar, remover } from '../controllers/estabelecimentos.controller.js';

const router = Router();

router.get('/', listar);
router.post('/', criar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', remover);

export default router;
