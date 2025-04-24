// oraculo-api/index.js

const express = require('express');
const fs = require('fs');
const Fuse = require('fuse.js');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Carrega a base de dados em JSON
const data = JSON.parse(fs.readFileSync('./dados.json'));

// Configuração do Fuse.js para busca por similaridade
const fuse = new Fuse(data, {
  keys: ['pergunta'],
  threshold: 0.4
});

// Rota para receber a pergunta e responder
app.post('/perguntar', (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: 'Pergunta não informada.' });
  }

  const resultado = fuse.search(pergunta);

  if (resultado.length > 0) {
    return res.json({ resposta: resultado[0].item.resposta });
  } else {
    return res.json({ resposta: 'Desculpe, não encontrei uma resposta para isso.' });
  }
});

app.listen(PORT, () => {
  console.log(`Oráculo rodando em http://localhost:${PORT}`);
});
