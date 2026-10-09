const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const db = require('./data/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (logo, etc.)
app.use('/static', express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../client/public')));

// API Routes
app.use('/api', apiRoutes);

// Serve frontend build if exists
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client not built yet, return a simple helpful HTML message
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Ed Barber Shop - API Online</title>
          <style>
            body { background: #0f1318; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
            h1 { color: #ef4444; margin-bottom: 8px; }
            p { color: #94a3b8; }
            a { color: #38bdf8; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Ed Barber Shop API</h1>
            <p>Servidor rodando com sucesso na porta ${PORT}!</p>
            <p>Para visualizar a interface React, execute: <code>npm run dev</code> ou <code>npm run build</code>.</p>
            <p><a href="/api/public-info">Testar Endpoint /api/public-info</a></p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Health check for Cloud Platforms (Render, Railway, etc.)
app.get('/healthz', (req, res) => res.status(200).send('OK'));

async function startServer() {
  await db.init();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`💈 Servidor Ed Barber Shop rodando na porta ${PORT}`);
    console.log(`👉 API disponível em: http://0.0.0.0:${PORT}/api/public-info`);
  });
}

startServer();
