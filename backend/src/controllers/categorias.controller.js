import { pool } from '../config/database.js';

export async function listar(req, res) {
    const { rows } = await pool.query(
        'SELECT * FROM categorias ORDER BY nome'
    );
    res.json(rows);
}
