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

## 🌐 Hospedagem Gratuita no Render (100% Grátis)

O projeto já está sincronizado no GitHub oficial:
👉 **[github.com/juniorbarbsa/ed-barber-shop](https://github.com/juniorbarbsa/ed-barber-shop)**

### 🚀 Publicação em 1 Clique no Render:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/juniorbarbsa/ed-barber-shop)

1. Acesse [render.com](https://render.com) e conecte com seu GitHub.
2. Clique no botão acima ou vá em **New +** > **Blueprint** (ou **Web Service**).
3. Selecione o repositório **juniorbarbsa/ed-barber-shop**.
4. Como o arquivo `render.yaml` já está configurado na raiz com o plano gratuito (`plan: free`), o Render configurará tudo automaticamente:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plano**: `Free` (sem custos)
5. Clique em **Apply** / **Deploy**. O sistema estará no ar em instantes com HTTPS e link público ativo.

---

## 🔑 Credenciais Administrativas do Barbeiro

- **Acesso**: Ícone de cadeado no menu superior ou rodapé
- **Usuário**: `ed` ou `edalves8127@gmail.com`
- **Senha**: `Ed5812`
- **WhatsApp do Ed**: `(73) 98116-4949`
- **Créditos**: Desenvolvido por **SCTECH** (sctechinova.com.br) • CNPJ: 59.070.203/0001-05
