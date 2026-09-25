# 💰 FinCore — Central Financeira

<div align="center">

![Status](https://img.shields.io/badge/status-finalizado-2563EB?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-3178C6?style=for-the-badge&logo=SQL&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-111827?style=for-the-badge)

### Uma plataforma moderna para gestão financeira pessoal e empresarial.

Controle receitas, despesas, cartões, metas, contas e indicadores em uma única interface elegante, rápida e intuitiva.

</div>

---

## ✨ Visão Geral

O **FinCore** é uma Central Financeira desenvolvida com foco em produtividade, organização e experiência premium.

O objetivo é oferecer um sistema semelhante aos grandes ERPs financeiros, porém com uma interface simples e moderna, permitindo acompanhar toda a saúde financeira em tempo real.

### Principais funcionalidades

- 📊 Dashboard financeiro inteligente
- 💸 Controle de receitas e despesas
- 💳 Gerenciamento de cartões de crédito
- 🏦 Contas bancárias e saldo consolidado
- 🎯 Metas financeiras
- 📅 Lançamentos recorrentes
- 📈 Gráficos e indicadores
- 🔍 Filtros e pesquisa avançada
- 🌙 Interface Dark Mode Premium
- 📱 Layout totalmente responsivo

---

# 🚀 Tecnologias

## Front-end

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

## Back-end

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Banco de Dados

- PostgreSQL

---

# 🏗️ Arquitetura

```text
                 Usuário
                    │
                    ▼
          React + TypeScript
                    │
          API REST (HTTPS)
                    │
                    ▼
          Node.js + Express
                    │
              Prisma ORM
                    │
                    ▼
              PostgreSQL
```

O projeto foi separado em camadas para facilitar manutenção, escalabilidade e futuras integrações.

---

# ☁️ Deploy

O FinCore foi planejado para hospedagem em serviços modernos e gratuitos durante o desenvolvimento.

| Serviço                 | Função          |
| ----------------------- | --------------- |
| **Vercel**              | Front-end React |
| **Render**              | API Node.js     |
| **PostgreSQL (Render)** | Banco de dados  |
| **GitHub**              | Versionamento   |
| **GitHub Actions**      | CI/CD (futuro)  |

### Fluxo de produção

```text
GitHub
   │
   ├────────► Vercel
   │            │
   │            ▼
   │      Front-end Online
   │
   └────────► Render
                │
                ▼
        API + PostgreSQL
```

---

# 📂 Estrutura do projeto

```bash
Fincore-Central-Financeira/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
│
├── server/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── prisma/
│
├── docs/
│   ├── dashboard.png
│   └── mobile.png
│
└── README.md
```

---

# ⚙️ Instalação

## 1. Clone o projeto

```bash
git clone https://github.com/Lazarin123/Fincore-Central-Financeira.git
```

## 2. Entre na pasta

```bash
cd Fincore-Central-Financeira
```

## 3. Instale as dependências

### Front-end

```bash
cd client
npm install
```

### Back-end

```bash
cd ../server
npm install
```

---

# 🔐 Variáveis de ambiente

### Server (`.env`)

```env
DATABASE_URL="postgresql://user:password@host:5432/fincore"

JWT_SECRET="sua_chave_super_secreta"

PORT=3000
```

### Client (`.env`)

```env
VITE_API_URL=https://fincore-api.onrender.com
```

---

# ▶️ Executando

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

---

# 📊 Módulos do sistema

| Módulo           | Status |
| ---------------- | ------ |
| Dashboard        | ✅     |
| Receitas         | ✅     |
| Despesas         | ✅     |
| Cartões          | 🚧     |
| Metas            | 🚧     |
| Contas Bancárias | 🚧     |
| Relatórios       | 🚧     |
| Perfil           | ⏳     |
| Configurações    | ⏳     |

---

# 🎯 Roadmap

## Versão 1.0

- [x] Dashboard
- [x] Cadastro de receitas
- [x] Cadastro de despesas
- [x] Layout responsivo
- [ ] Cartões de crédito
- [ ] Metas financeiras
- [ ] Autenticação JWT

## Versão 2.0

- [ ] Contas compartilhadas
- [ ] Pix recorrente
- [ ] Anexar comprovantes
- [ ] Categorias personalizadas
- [ ] Exportação PDF
- [ ] Exportação Excel

## Versão 3.0

- [ ] Inteligência Artificial para análise financeira
- [ ] Previsão de gastos mensais
- [ ] Alertas automáticos
- [ ] Assistente financeiro
- [ ] Aplicativo Mobile (React Native)

---

# 💡 Ideias de melhorias

Estas funcionalidades elevariam o FinCore para um nível profissional de SaaS.

### Inteligência financeira

- IA sugerindo economia mensal
- Classificação automática de despesas
- Insights personalizados
- Previsão de saldo

### Produtividade

- Drag & Drop de lançamentos
- Atalhos de teclado
- Dashboard personalizável
- Widgets

### Financeiro

- Controle de investimentos
- Reserva de emergência
- Parcelamentos inteligentes
- Faturas automáticas
- Fluxo de caixa empresarial

### Integrações

- Open Finance
- Stripe
- Mercado Pago
- Notificações por WhatsApp
- Google Calendar

---

# 🔒 Segurança

O projeto seguirá boas práticas de desenvolvimento:

- JWT Authentication
- Hash de senhas com BCrypt
- Validação com Zod
- Prisma ORM (proteção contra SQL Injection)
- HTTPS em produção
- Variáveis sensíveis via `.env`

---

# 📈 Performance

- ⚡ Vite para build ultrarrápido
- 📦 Code Splitting
- 💤 Lazy Loading
- 🎨 Tailwind otimizado
- 🚀 Deploy CDN pela Vercel

---

# 🤝 Contribuição

Contribuições são bem-vindas.

1. Faça um Fork
2. Crie uma branch

```bash
git checkout -b feature/nova-funcionalidade
```

3. Commit

```bash
git commit -m "feat: nova funcionalidade"
```

4. Push

```bash
git push origin feature/nova-funcionalidade
```

5. Abra um Pull Request

---

# 👨‍💻 Autor

**Samuel Lazarin**

Desenvolvedor Full Stack | QA Automation | UI/UX

- GitHub: https://github.com/Lazarin123
- LinkedIn: https://linkedin.com/in/samuel-lazarin

---

<div align="center">

### ⭐ Se este projeto foi útil, deixe uma Star no repositório!

**FinCore — Central Financeira**

Sua vida financeira, organizada de forma inteligente.

</div>
