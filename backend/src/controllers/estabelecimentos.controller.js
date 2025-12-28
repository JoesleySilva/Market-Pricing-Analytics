import { pool } from '../config/database.js';

export async function listar(req, res) {
    try {
    const { rows } = await pool.query(
      'SELECT * FROM comparar_precos.estabelecimentos ORDER BY id'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar estabelecimentos' });
  }
}

export async function criar(req, res) {
    const { nome, cnpj, cidade, estado, endereco } = req.body;

    const { rows } = await pool.query(
        `INSERT INTO estabelecimentos (nome, cnpj, cidade, estado, endereco)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [nome, cnpj, cidade, estado, endereco]
    );
    res.status(201).json(rows[0]);

}

export async function deletar(req, res) {
    await pool.query(
        'DELETE FROM estabelecimentos WHERE id = $1',
        [req.params.id]
    );
    res.status(204).send();
}
