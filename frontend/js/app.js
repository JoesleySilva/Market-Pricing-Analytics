console.log('Frontend app.js carregado');

// API
const API_URL = 'http://localhost:3000/api';

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

  if (tabName === 'estabelecimentos') {
    listarEstabelecimentos();
  }
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
    body: JSON.stringify({
      nome,
      cnpj,
      telefone,
      cidade,
      estado,
      endereco
    })
  });

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
  const res = await fetch(`${API_URL}/estabelecimentos`);
  const dados = await res.json();

  const tbody = document.getElementById('estabelecimentosBody');
  tbody.innerHTML = '';

  dados.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.nome}</td>
        <td>${e.cnpj}</td>
        <td>${e.cidade ?? ''}</td>
        <td>${e.estado ?? ''}</td>
        <td>-</td>
      </tr>
    `;
  });
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



document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard();
});


// --------------------
// EXPOR PARA O HTML
// --------------------
window.showTab = showTab;
window.cadastrarEstabelecimento = cadastrarEstabelecimento;
