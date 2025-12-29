import { pool } from '../config/database.js';

/* LISTAR */
export async function listar(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.nome,
        p.marca,
        p.unidade_medida,
        p.codigo_barras,
        p.observacoes,
        c.nome AS categoria
      FROM produtos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      ORDER BY p.nome
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
}

/* BUSCAR POR ID */
export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM produtos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
}

/* CRIAR */
export async function criar(req, res) {
  try {
    const {
      nome,
      marca,
      categoria_id,
      unidade_medida,
      codigo_barras,
      observacoes
    } = req.body;

    const query = `
      INSERT INTO produtos
      (nome, marca, categoria_id, unidade_medida, codigo_barras, observacoes)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const valores = [
      nome,
      marca || null,
      categoria_id || null,
      unidade_medida || null,
      codigo_barras || null,
      observacoes || null
    ];

    const { rows } = await pool.query(query, valores);
    res.status(201).json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
}

/* ATUALIZAR */
export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      nome,
      marca,
      categoria_id,
      unidade_medida,
      codigo_barras,
      observacoes
    } = req.body;

    const result = await pool.query(
      `
      UPDATE produtos SET
        nome = $1,
        marca = $2,
        categoria_id = $3,
        unidade_medida = $4,
        codigo_barras = $5,
        observacoes = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
      `,
      [nome, marca, categoria_id, unidade_medida, codigo_barras, observacoes, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
}

/* REMOVER */
export async function remover(req, res) {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM produtos WHERE id = $1', [id]);

    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover produto' });
  }
}