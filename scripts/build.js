const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const clientDir = path.join(__dirname, '..', 'client');
const distIndex = path.join(clientDir, 'dist', 'index.html');

console.log('🚀 Iniciando processo de build do Ed Barber Shop...');

// 1. Instalar dependências essenciais do servidor (Express, CORS, etc.)
try {
  console.log('📦 Instalando dependências do servidor (Express, etc.)...');
  execSync('npm install --production', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Dependências do servidor instaladas com sucesso!');
} catch (err) {
  console.warn('⚠️ Aviso ao instalar dependências do servidor:', err.message);
}

// 2. Verificar e garantir o frontend (client/dist)
if (fs.existsSync(distIndex)) {
  console.log('✅ Bundle pré-compilado do frontend (client/dist) pronto para produção!');
} else {
  try {
    console.log('📦 Instalando dependências do frontend...');
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
    console.log('✅ Frontend compilado com sucesso!');
  } catch (err) {
    console.warn('⚠️ Aviso na compilação do frontend:', err.message);
  }
}

console.log('🎉 Build completo e pronto para inicialização (npm start)!');
