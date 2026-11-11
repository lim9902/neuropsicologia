const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
let pedidos = [];
app.get('/', (req, res) => {
  res.json({ status: "Backend E-book's Psicologicos ONLINE" });
});
app.get('/api/livros', (req, res) => {
  res.json([{ id: 1, titulo: "A MENTE QUE OBEDECE", autor: "Idelton Antonio Vuco", preco: 200, moeda: "MZN" }]);
});
app.post('/api/criar-pagamento', (req, res) => {
  const pedido = { id: "PED-" + Date.now(), ...req.body, status: "pendente" };
  pedidos.push(pedido);
  res.json({ sucesso: true, pedidoId: pedido.id });
});
app.post('/api/webhook/pagar', (req, res) => {
  console.log("Webhook:", req.body);
  const { pedidoId, status } = req.body;
  if (status === "concluido" || status === "sucesso" || status === "paid") {
    const p = pedidos.find(x => x.id === pedidoId);
    if (p) p.status = "pago";
  }
  res.status(200).json({ recebido: true });
});
app.get('/api/verificar-pagamento/:pedidoId', (req, res) => {
  const p = pedidos.find(x => x.id === req.params.pedidoId);
  if (!p) return res.status(404).json({ erro: "Nao encontrado" });
  res.json({ status: p.status });
});
app.listen(PORT, () => console.log("A correr na porta " + PORT));
