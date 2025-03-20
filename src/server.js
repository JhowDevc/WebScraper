const express = require('express');
const { scrapeWebsite } = require('./scraper');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Por favor, insira uma URL válida' });
  }
  const data = await scrapeWebsite(url);
  res.json(data);
});

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  await open(`http://localhost:${PORT}`); // Abre o navegador automaticamente
});