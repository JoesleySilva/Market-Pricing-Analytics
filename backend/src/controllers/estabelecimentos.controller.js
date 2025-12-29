import { pool } from '../config/database.js';

/**
 * CREATE
 * POST /api/estabelecimentos
 */
export async function criar(req, res) {
  const {
    nome,
    cnpj,
    telefone,
    cidade,
    estado,
    endereco
  } = req.body;

  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO estabelecimentos
        (nome, cnpj, telefone, cidade, estado, endereco)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nome, cnpj, telefone, cidade, estado, endereco]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar estabelecimento' });
  }
}

/**
 * READ (LIST)
 * GET /api/estabelecimentos
 */
export async function listar(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        id,
        nome,
        cnpj,
        telefone,
        cidade,
        estado,
        endereco,
        created_at,
        updated_at
       FROM estabelecimentos
       ORDER BY nome`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar estabelecimentos' });
  }
}

/**
 * READ (BY ID)
 * GET /api/estabelecimentos/:id
 */
export async function buscarPorId(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        id,
        nome,
        cnpj,
        telefone,
        cidade,
        estado,
        endereco
       FROM estabelecimentos
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Estabelecimento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar estabelecimento' });
  }
}

/**
 * UPDATE (ALL FIELDS)
 * PUT /api/estabelecimentos/:id
 */
export async function atualizar(req, res) {
  const { id } = req.params;
  const {
    nome,
    cnpj,
    telefone,
    cidade,
    estado,
    endereco
  } = req.body;

  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `UPDATE estabelecimentos SET
        nome = $1,
        cnpj = $2,
        telefone = $3,
        cidade = $4,
        estado = $5,
        endereco = $6,
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [nome, cnpj, telefone, cidade, estado, endereco, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Estabelecimento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar estabelecimento' });
  }
}

/**
 * DELETE
 * DELETE /api/estabelecimentos/:id
 */
export async function remover(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM estabelecimentos WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Estabelecimento não encontrado' });
    }

    res.json({ mensagem: 'Estabelecimento removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao remover estabelecimento' });
  }
}
