import { pool } from '../config/database.js';

export async function listarCategorias(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nome FROM categorias ORDER BY nome'
    );

    res.json(result.rows);
    console.log('Buscando categorias...');
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
}
