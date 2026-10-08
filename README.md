# 💈 Ed Barber Shop (Desde 1999) - Sistema de Agendamentos & Landing Page

Sistema moderno, interativo e completo de agendamento online para barbearia, desenvolvido em **React**, **Node.js/Express**, **Tailwind CSS** com estética **Glassmorphism**, integração direta com **WhatsApp**, **Calendário Dinâmico** e **Painel Administrativo protegido por senha**.

---

## ✨ Principais Funcionalidades

- **🎨 Design Ultra Moderno ("Interactive Glass")**:
  - Estética refinada com efeito de vidro fosco (*frosted glass*), bordas luminosas e paleta visual extraída da identidade oficial da barbearia (preto ônix, carmesim do barber pole e azul real).
  - Logo oficial com **fundo transparente** em alta definição (`/logo.png`).
  - Animações fluidas e responsivas para smartphones, tablets e desktop.

- **🟢 Controle de Status em Tempo Real ("Atendendo Agora" / "Não está atendendo")**:
  - O barbeiro pode pausar ou reabrir os agendamentos instantaneamente no painel administrativo.
  - Alerta dinâmico na página principal com mensagem customizável (ex: *"Em almoço"*, *"Horários pausados"*).

- **📅 Calendário Interativo & Vagas em Tempo Real**:
  - Navegação intuitiva entre meses e dias.
  - Filtro automático de dias de trabalho e bloqueio de datas passadas.
  - Geração de horários disponíveis (calcula automaticamente almoço, durações e impede reservas duplicadas).

- **📲 Redirecionamento Automático para WhatsApp**:
  - Ao finalizar o agendamento no site, a vaga é gravada no sistema e o cliente é redirecionado para o WhatsApp do Ed com a mensagem pré-formatada:
    - Nome do Cliente
    - Telefone / WhatsApp
    - Serviço Escolhido
    - Data e Horário
    - Valor total

- **🔐 Painel do Barbeiro com Senha**:
  - Senha padrão de acesso: `ed1999` (pode ser alterada a qualquer momento no painel).
  - Interruptor rápido de status: *Atendendo* / *Pausar*.
  - Gestão visual de agendamentos com filtros: *Hoje*, *Próximos*, *Histórico Completo*.
  - Botão de conversa direta com o cliente via WhatsApp com 1 clique.
  - Ações para **Concluir**, **Cancelar** ou **Excluir** agendamentos.
  - Bloqueio manual de horários e folgas.
  - Cadastro, edição e exclusão de serviços e preços.
  - Configuração do número de WhatsApp do barbeiro e horários de funcionamento.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js (v18 ou superior) instalado.

### 2. Instalação das Dependências
Na raiz do projeto (`C:\ed_barber`), execute:
```bash
npm run install:all
```

### 3. Modo de Desenvolvimento (Hot-reload)
```bash
npm run dev
```
- Acesse: `http://localhost:5173` (Frontend com proxy automático para a API)

### 4. Modo de Produção Local
```bash
npm run build
npm start
```
- Acesse: `http://localhost:5000`

---

## 🌐 Como Hospedar Gratuitamente (Passo a Passo)

A aplicação foi configurada em arquitetura unificada (*Single Web Service*), o que permite rodar **100% grátis** no plano Free do **Render.com**, **Railway** ou **Koyeb**.

### Opção Recomendada: Render.com (100% Gratuito)

1. Crie uma conta gratuita em [render.com](https://render.com).
2. Suba este projeto para um repositório no seu GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: ed barber shop booking system"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/ed-barber.git
   git push -u origin main
   ```
3. No painel do Render:
   - Clique em **New +** > **Web Service**.
   - Conecte o repositório GitHub que você acabou de criar.
   - Configure os campos:
     - **Name**: `ed-barber-shop`
     - **Runtime**: `Node`
     - **Build Command**: `npm run install:all && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`
4. Clique em **Create Web Service**.
5. Em poucos minutos seu sistema estará online com link HTTPS público gratuito (ex: `https://ed-barber-shop.onrender.com`).

---

## 🔑 Credenciais Padrão

- **Acesso do Barbeiro**: Ícone de cadeado no menu superior ou rodapé.
- **Senha Inicial**: `ed1999`
- *Lembre-se de alterar o número do WhatsApp nas configurações do painel para o seu número real!*
