# ⚙️ Back-end – Sistema de Vistorias

API responsável por autenticação, gerenciamento de vistorias,
dashboard e notificações.

---

## 🛠️ Tecnologias

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod

---

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração
- Crie um arquivo .env com:

```
DATABASE_URL=postgresql://user:password@localhost:5432/epta
JWT_SECRET=secret 
```
## 🗄️ Banco de Dados
```
npx prisma migrate dev
npx prisma generate

## Executar a API
npm run dev

````
### API disponível em: http://localhost:3333

## 🔐 Autenticação
A API utiliza autenticação via JWT.
Rotas protegidas exigem token no header:

```
Authorization: Bearer <token> `
```

## 📡 Rotas Principais

### 🔑 Auth
- POST /sessions → Login

### 🚗 Vistorias
- GET /inspections → Lista vistorias (com filtros e paginação)
- GET /inspections/:id → Detalhe da vistoria
- POST /inspections → Cria nova vistoria
- PATCH /inspections/:id/approve → Aprova vistoria
- PATCH /inspections/:id/reject → Reprova vistoria

### ❌ Motivos de Reprovação
- GET /rejection-reasons

### 🔔 Notificações
- GET /notifications
- GET /notifications/unread-count
- PATCH /notifications/:id/read

## Testes

Os testes unitários do backend utilizam Vitest e focam na camada de serviços (regras de negócio),
sem dependência de banco (Prisma mockado).

### Rodar testes
```bash
pnpm install
pnpm test
```


## 🧠 Observações Técnicas
- Organização por domínio
- Middleware de autenticação
- Validação com Zod
- RBAC aplicado nas rotas
- Paginação no backend

### Voltar - ⬅️ **[`Readme.md `](../README.md)**
### Front - 🎨[` Front Readme.md `](../client/README.md)

