console.log('Frontend app.js carregado');

// API
const API_URL = 'http://localhost:3000/api';

let estabelecimentoEditandoId = null;

let listaCompras = [];
// --------------------
// MENU
// --------------------
function showTab(tabName, button) {
  document.querySelectorAll('.tab-content')
    .forEach(t => t.classList.remove('active'));

  document.querySelectorAll('.tab-button')
    .forEach(b => b.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  button.classList.add('active');
  
  //Assim o dashboard sempre atualiza ao clicar na aba.
  if (tabName === 'dashboard') {
  carregarDashboard();
  }

  if (tabName === 'produtos') {
  listarProdutos();
  }

  if (tabName === 'estabelecimentos') {
    listarEstabelecimentos();
  }

  // 👇 carregar dados conforme a aba
  if (tabName === 'precos') {
      carregarEstabelecimentosSelect();
      carregarProdutosSelect(); // se existir
  }

  if (tabName === 'listaCompras') {
  carregarProdutosListaCompras();
  }
}


function limparFormularioEstabelecimento() {
  document.getElementById('estabelecimentoNome').value = '';
  document.getElementById('estabelecimentoCnpj').value = '';
  document.getElementById('estabelecimentoTelefone').value = '';
  document.getElementById('estabelecimentoCidade').value = '';
  document.getElementById('estabelecimentoEstado').value = '';
  document.getElementById('estabelecimentoEndereco').value = '';

  estabelecimentoEditandoId = null;

  const btn = document.getElementById('btnEstabelecimento');
  btn.textContent = '➕ Adicionar Estabelecimento';
  btn.classList.remove('btn-warning');
  btn.classList.add('btn-success');
}



// --------------------
// ESTABELECIMENTOS
// --------------------
async function cadastrarEstabelecimento() {
  const nome = document.getElementById('estabelecimentoNome').value;
  const cnpj = document.getElementById('estabelecimentoCnpj').value;
  const telefone = document.getElementById('estabelecimentoTelefone').value;
  const cidade = document.getElementById('estabelecimentoCidade').value;
  const estado = document.getElementById('estabelecimentoEstado').value;
  const endereco = document.getElementById('estabelecimentoEndereco').value;

  if (!nome || !cnpj) {
    alert('Nome e CNPJ são obrigatórios');
    return;
  }

  const response = await fetch(`${API_URL}/estabelecimentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({  nome, cnpj, telefone, cidade,estado, endereco})  });

  if (!response.ok) {
    const erro = await response.json();
    alert('Erro: ' + erro.erro);
    return;
  }

  alert('Estabelecimento cadastrado com sucesso!');
  listarEstabelecimentos();
}

// --------------------
// LISTAR ESTABELECIMENTOS
// --------------------
async function listarEstabelecimentos() {
    const tbody = document.getElementById('estabelecimentosBody');

    try {
        const res = await fetch(`${API_URL}/estabelecimentos`);
        const dados = await res.json();

        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">Nenhum estabelecimento cadastrado</td>
                </tr>
            `;
            return;
        }

        dados.forEach(est => {
            tbody.innerHTML += `
                <tr>
                    <td>${est.nome}</td>
                    <td>${est.cnpj}</td>
                    <td>${est.cidade ?? '-'}</td>
                    <td>${est.estado ?? '-'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-warning btn-sm"
                            onclick="editarEstabelecimento(${est.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-danger btn-sm"
                            onclick="excluirEstabelecimento(${est.id})">
                            🗑️ Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr><td colspan="5">Erro ao carregar estabelecimentos</td></tr>
        `;
    }
}


async function carregarEstabelecimentosSelect() {
    try {
        const res = await fetch(`${API_URL}/estabelecimentos`);

        if (!res.ok) {
            throw new Error('Erro ao buscar estabelecimentos');
        }

        const estabelecimentos = await res.json();

        const select = document.getElementById('estabelecimentoSelect');

        // limpa antes de carregar
        select.innerHTML = '<option value="">Selecione o estabelecimento</option>';

        estabelecimentos.forEach(est => {
            const option = document.createElement('option');
            option.value = est.id;       // ID vai para o backend
            option.textContent = `${est.nome} - ${est.cidade}/${est.estado}`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar estabelecimentos');
    }
}

async function excluirEstabelecimento(id) {
    if (!confirm('Deseja realmente excluir este estabelecimento?')) return;

    try {
        const res = await fetch(`${API_URL}/estabelecimentos/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error('Erro ao excluir');
        }

        alert('Estabelecimento excluído com sucesso!');
        listarEstabelecimentos();

    } catch (error) {
        alert('Erro ao excluir estabelecimento');
        console.error(error);
    }
}

async function editarEstabelecimento(id) {
    const response = await fetch(`${API_URL}/estabelecimentos/${id}`);
    const est = await response.json();

    document.getElementById('estabelecimentoNome').value = est.nome;
    document.getElementById('estabelecimentoCnpj').value = est.cnpj;
    document.getElementById('estabelecimentoTelefone').value = est.telefone || '';
    document.getElementById('estabelecimentoCidade').value = est.cidade || '';
    document.getElementById('estabelecimentoEstado').value = est.estado || '';
    document.getElementById('estabelecimentoEndereco').value = est.endereco || '';

    // guarda o ID para o botão salvar
    estabelecimentoEditandoId = id;

    const btn = document.getElementById('btnEstabelecimento');
    btn.textContent = '💾 Atualizar Estabelecimento';
    btn.classList.remove('btn-success');
    btn.classList.add('btn-warning');
}


async function salvarEstabelecimento() {
  const nome = document.getElementById('estabelecimentoNome').value;
  const cnpj = document.getElementById('estabelecimentoCnpj').value;
  const telefone = document.getElementById('estabelecimentoTelefone').value;
  const cidade = document.getElementById('estabelecimentoCidade').value;
  const estado = document.getElementById('estabelecimentoEstado').value;
  const endereco = document.getElementById('estabelecimentoEndereco').value;

  if (!nome || !cnpj) {
    alert('Nome e CNPJ são obrigatórios');
    return;
  }

  const payload = {
    nome,
    cnpj,
    telefone,
    cidade,
    estado,
    endereco
  };

  const url = estabelecimentoEditandoId
    ? `${API_URL}/estabelecimentos/${estabelecimentoEditandoId}`
    : `${API_URL}/estabelecimentos`;

  const method = estabelecimentoEditandoId ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    alert('Erro ao salvar estabelecimento');
    return;
  }

  alert(
    estabelecimentoEditandoId
      ? 'Estabelecimento atualizado com sucesso!'
      : 'Estabelecimento cadastrado com sucesso!'
  );

  limparFormularioEstabelecimento();
  listarEstabelecimentos();
}



// --------------------
// PRODUTOS
// --------------------
async function cadastrarProduto() {
  const nome = document.getElementById('produtoNome').value;
  const marca = document.getElementById('produtoMarca').value;
  const categoria_id = document.getElementById('produtoCategoria').value;
  const unidade_medida = document.getElementById('produtoUnidade').value;

  if (!nome) {
    alert("Nome do produto é obrigatório");
    return;
  }

  const payload = {
    nome,
    marca,
    categoria_id: categoria_id || null,
    unidade_medida
  };

  try {
    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.erro || 'Erro ao cadastrar produto');
    }

    alert('Produto cadastrado com sucesso!');

    // limpa formulário
    document.getElementById('produtoNome').value = '';
    document.getElementById('produtoMarca').value = '';
    document.getElementById('produtoCategoria').value = '';
    document.getElementById('produtoUnidade').value = '';

    // atualiza lista e dashboard
    listarProdutos();
    carregarDashboard();

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}


async function listarProdutos() {
  const tbody = document.getElementById('produtosBody');

  try {
    const res = await fetch(`${API_URL}/produtos`);
    const produtos = await res.json();

    tbody.innerHTML = '';

    if (produtos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">Nenhum produto cadastrado</td>
        </tr>
      `;
      return;
    }

    produtos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.nome}</td>
          <td>${p.marca ?? '-'}</td>
          <td>${p.categoria ?? '-'}</td>
          <td>${p.unidade_medida ?? '-'}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm">✏️ Editar</button>
            <button class="btn btn-danger btn-sm">🗑️ Excluir</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Erro ao carregar produtos</td>
      </tr>
    `;
  }
}

// --------------------
// DASHBOARD
// --------------------
async function carregarDashboard() {
  const res = await fetch(`${API_URL}/dashboard`);
  const dados = await res.json();

  document.getElementById('totalProdutos').innerText = dados.totalProdutos;
  document.getElementById('totalEstabelecimentos').innerText = dados.totalEstabelecimentos;
  document.getElementById('totalPrecos').innerText = dados.totalPrecos;
  document.getElementById('totalPromocoes').innerText = dados.totalPromocoes;

  const tbody = document.getElementById('ultimosPrecosBody');
  tbody.innerHTML = '';

  if (dados.ultimosPrecos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhum registro</td></tr>';
    return;
  }

  dados.ultimosPrecos.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.produto}</td>
        <td>${p.estabelecimento}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td>-</td>
        <td>${new Date(p.data_compra).toLocaleDateString()}</td>
      </tr>
    `;
  });
}


// --------------------
// CATEGORIAS
// --------------------



async function carregarCategorias() {
  try {
    const response = await fetch('http://localhost:3000/api/categorias');
    const categorias = await response.json();

    const select = document.getElementById('produtoCategoria');

    // limpa opções antigas
    select.innerHTML = '<option value="">Selecione a categoria</option>';

    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;      // vai para categoria_id no backend
      option.textContent = cat.nome;
      select.appendChild(option);
    });

  } catch (err) {
    console.error('Erro ao carregar categorias', err);
  }
}

// --------------------
// LISTA DE COMPRAS
// --------------------
async function carregarProdutosListaCompras() {
  const res = await fetch(`${API_URL}/produtos`);
  const produtos = await res.json();

  const select = document.getElementById('listaProdutoSelect');
  select.innerHTML = '<option value="">Selecione um produto</option>';

  produtos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.nome} ${p.marca ? '- ' + p.marca : ''}`;
    select.appendChild(option);
  });
}


function adicionarProdutoLista() {
  const produtoId = document.getElementById('listaProdutoSelect').value;
  const produtoNome = document.getElementById('listaProdutoSelect')
    .selectedOptions[0]?.textContent;

  const quantidade = Number(document.getElementById('listaQuantidade').value);

  if (!produtoId || quantidade <= 0) {
    alert('Selecione um produto e informe a quantidade');
    return;
  }

  // evita duplicar
  const existente = listaCompras.find(p => p.produtoId == produtoId);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    listaCompras.push({
      produtoId,
      produtoNome,
      quantidade
    });
  }

  renderizarListaCompras();

  document.getElementById('listaQuantidade').value = '';
}


function renderizarListaCompras() {
  const tbody = document.getElementById('listaComprasBody');
  tbody.innerHTML = '';

  if (listaCompras.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">Nenhum item adicionado</td></tr>';
    return;
  }

  listaCompras.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.produtoNome}</td>
        <td>${item.quantidade}</td>
        <td>
          <button class="btn btn-danger btn-sm"
            onclick="removerItemLista(${index})">
            🗑️ Remover
          </button>
        </td>
      </tr>
    `;
  });
}


function removerItemLista(index) {
  listaCompras.splice(index, 1);
  renderizarListaCompras();
}
// --------------------
// EXPOR PARA O HTML
// --------------------
window.showTab = showTab;
window.cadastrarEstabelecimento = cadastrarEstabelecimento;
window.listarEstabelecimentos = listarEstabelecimentos;
window.excluirEstabelecimento = excluirEstabelecimento;
window.editarEstabelecimento = editarEstabelecimento;
window.onload = () => {
  carregarDashboard();   // 🔥 ISSO FALTAVA
  carregarCategorias();
};
window.adicionarProdutoLista = adicionarProdutoLista;
window.removerItemLista = removerItemLista;