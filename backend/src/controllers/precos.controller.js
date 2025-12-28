import { pool } from '../config/database.js';

export async function criar(req, res) {
    const {
        produto_id,
        estabelecimento_id,
        preco,
        quantidade,
        data_compra,
        eh_promocao,
        observacoes
    } = req.body;

    const { rows } = await pool.query(
        `INSERT INTO precos
        (produto_id, estabelecimento_id, preco, quantidade, data_compra, eh_promocao, observacoes)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [produto_id, estabelecimento_id, preco, quantidade, data_compra, eh_promocao, observacoes]
    );

    res.status(201).json(rows[0]);
}

export async function listar(req, res) {
    const { rows } = await pool.query(
        `SELECT p.*, pr.nome AS produto_nome, e.nome AS estabelecimento_nome
         FROM precos p
         JOIN produtos pr ON pr.id = p.produto_id
         JOIN estabelecimentos e ON e.id = p.estabelecimento_id
         ORDER BY p.data_compra DESC`
    );

    res.json(rows);
}
