const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, '..', 'client');
const distIndex = path.join(clientDir, 'dist', 'index.html');

console.log('🚀 Iniciando processo de build do Ed Barber Shop...');

try {
  console.log('📦 Instalando dependências do frontend (incluindo Vite e plugins)...');
  execSync('npm install --include=dev', {
    cwd: clientDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  console.log('⚡ Compilando o frontend com Vite...');
  execSync('npm run build', {
    cwd: clientDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  console.log('✅ Frontend compilado com sucesso em client/dist!');
} catch (err) {
  console.warn('⚠️ Aviso durante compilação do Vite:', err.message);
  if (fs.existsSync(distIndex)) {
    console.log('✅ Utilizando bundle pré-compilado de client/dist existente.');
  } else {
    console.error('❌ Falha crítica: client/dist não encontrado.');
    process.exit(1);
  }
}
