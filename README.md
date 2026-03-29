# CRM - Sistema de Gerenciamento de Clientes

CRM completo construído com **NestJS**, **Supabase** e **Next.js + Ant Design**.

---

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend API | NestJS 10 (TypeScript), JWT Auth, RBAC |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Frontend | Next.js 14 (App Router), Ant Design 5 |
| i18n | next-intl — EN + PT (cookie) |
| Auth | NextAuth v4 — GitHub + Google OAuth |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |

---

## 📁 Estrutura

```
apps/
  backend/               NestJS API (porta 3001)
    src/
      modules/
        auth/            Validação JWT + getOrCreate user
        users/           CRUD + RBAC (USER/MANAGER/ADMIN)
        contacts/        Gestão de contatos
        companies/       Gestão de empresas
        interactions/    Registro de ligações/emails/reuniões
        deals/           Oportunidades (pipeline)
        tasks/           Tarefas
        groups/          Grupos de gerentes
        dashboard/       Agregação de KPIs
        notifications/   Notificações in-app
      supabase/          Cliente Supabase (global)
      common/            Guards, Decorators, Types
    supabase/
      migrations/        001_initial_schema.sql
  frontend/              Next.js (porta 3000)
    src/app/
      (app)/             Páginas autenticadas
        dashboard/       Dashboard com KPIs
        contacts/        Lista + detalhe de contato
        companies/       Empresas
        deals/           Pipeline Kanban (drag & drop)
        tasks/           Tarefas
        calendar/        Calendário c/ badges
        groups/          Grupos
        notifications/   Notificações
        settings/        Perfil e idioma
      auth/signin/       Página OAuth
      api/auth/          Handler NextAuth
      api/locale/        Setter de cookie de locale
    messages/            en.json + pt.json
```

---

## ⚙️ Pré-requisitos

- Node.js >= 18
- Conta no [Supabase](https://supabase.com) (grátis)
- OAuth App no GitHub e/ou Google

---

## 🔧 Instalação

### 1. Instalar dependências

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Banco de dados — Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de:
   ```
   apps/backend/supabase/migrations/001_initial_schema.sql
   ```
3. Nos **Project Settings → API** copie:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. OAuth

**GitHub:**
1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copie `Client ID` → `GITHUB_ID` e `Client Secret` → `GITHUB_SECRET`

**Google:**
1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Copie → `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

### 4. Variáveis de ambiente

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
```

Preencha `apps/backend/.env`:
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=<mesmo valor que NEXTAUTH_SECRET>
FRONTEND_URL=http://localhost:3000
```

```bash
# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
```

Preencha `apps/frontend/.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret — gere com: openssl rand -base64 32>
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> ⚠️ **Importante:** `JWT_SECRET` (backend) e `NEXTAUTH_SECRET` (frontend) **devem ser o mesmo valor**.

### 5. Executar

```bash
# Terminal 1 — Backend
cd apps/backend
npm run start:dev

# Terminal 2 — Frontend
cd apps/frontend
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001/api

---

## 🔒 Perfis (RBAC)

| Perfil | Acesso |
|--------|--------|
| **USER** | Apenas seus próprios registros |
| **MANAGER** | Registros do seu grupo |
| **ADMIN** | Acesso total ao tenant |

O primeiro usuário criado receberá o perfil `USER`. Para promover a `ADMIN`:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

---

## ✅ Funcionalidades implementadas

- Autenticação OAuth (GitHub + Google) via NextAuth
- CRUD completo: Contatos, Empresas, Deals, Tarefas, Grupos
- Pipeline Kanban com drag & drop (6 estágios)
- Registro de interações (Ligação, Email, Reunião) com timeline
- Dashboard com KPIs (conversão, valor, tarefas em atraso)
- Calendário com badges de tarefas por data
- Notificações in-app com badge de contagem
- RBAC (USER / MANAGER / ADMIN) com guards no backend
- Multi-idioma PT ↔ EN com preferência salva em cookie
- Multi-tenant — dados isolados por `tenant_id`
- Rate limiting (100 req / 60s), Helmet, CORS configurados
- Validação forte com class-validator e class-transformer

