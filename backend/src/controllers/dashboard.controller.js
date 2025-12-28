import { pool } from '../config/database.js';

export async function resumo(req, res) {
  try {
    const [
      produtos,
      estabelecimentos,
      precos,
      promocoes,
      ultimosPrecos
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM comparar_precos.produtos'),
      pool.query('SELECT COUNT(*) FROM comparar_precos.estabelecimentos'),
      pool.query('SELECT COUNT(*) FROM comparar_precos.precos'),
      pool.query('SELECT COUNT(*) FROM comparar_precos.precos WHERE eh_promocao = true'),
      pool.query(`
        SELECT p.nome AS produto, e.nome AS estabelecimento, pr.preco, pr.data_compra
        FROM comparar_precos.precos pr
        JOIN comparar_precos.produtos p ON p.id = pr.produto_id
        JOIN comparar_precos.estabelecimentos e ON e.id = pr.estabelecimento_id
        ORDER BY pr.created_at DESC
        LIMIT 5
      `)
    ]);

    res.json({
      totalProdutos: produtos.rows[0].count,
      totalEstabelecimentos: estabelecimentos.rows[0].count,
      totalPrecos: precos.rows[0].count,
      totalPromocoes: promocoes.rows[0].count,
      ultimosPrecos: ultimosPrecos.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao carregar dashboard' });
  }
}
