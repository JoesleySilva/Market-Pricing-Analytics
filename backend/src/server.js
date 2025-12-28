import express from 'express';
import cors from 'cors';
import estabelecimentosRoutes from './routes/estabelecimentos.routes.js';
import produtosRoutes from './routes/produtos.routes.js';
import precosRoutes from './routes/precos.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/estabelecimentos', estabelecimentosRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/precos', precosRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/api', (req, res) => {
    res.json({ status: 'API OK' });
});

app.get('/teste', (req, res) => {
  res.json({ status: 'API OK' });
});

//app.get('/teste', (req, res) => {
//  res.json({ status: 'API OK' });
//});


//app.get('/api/estabelecimentos', (req, res) => {
//  res.json({ teste: 'rota direta funcionando' });
//});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
