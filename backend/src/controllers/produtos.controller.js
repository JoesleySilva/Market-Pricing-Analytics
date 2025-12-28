import { pool } from '../config/database.js';

export async function listar(req, res) {
    const { rows } = await pool.query(
        'SELECT * FROM produtos ORDER BY nome'
    );
    res.json(rows);
}

export async function criar(req, res) {
    const { nome, marca, categoria_id, unidade_medida } = req.body;

    const { rows } = await pool.query(
        `INSERT INTO produtos (nome, marca, categoria_id, unidade_medida)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [nome, marca, categoria_id, unidade_medida]
    );

    res.status(201).json(rows[0]);
}

export async function deletar(req, res) {
    await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id]);
    res.status(204).send();
}
