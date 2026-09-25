# Central Financeira

Painel financeiro desktop/web: **React + Vite + Electron** (front/app), **Node + Express** (API), **PostgreSQL** (Neon/Supabase).

## Rodar localmente
1. `cd backend && cp .env.example .env` (preencha DATABASE_URL e JWT_SECRET) → `npm install && npm run db:init && npm run dev`
2. `cd frontend && cp .env.example .env` → `npm install && npm run dev` (web) ou `npm run electron:dev` (janela desktop)

## Gerar executável
`cd frontend && npm run electron:build` → instalador em `frontend/release/`

## Recursos
- CRUD de transações, categorias, metas, saldo atual, projeção de saldo e relatório consolidado (JSON)
- Exportação de CSV e PDF direto no app
- Offline-first: leituras em cache + fila de escritas sincronizada ao reconectar (IDs UUID gerados no cliente, API idempotente)
