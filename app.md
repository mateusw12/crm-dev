# 🚀 Projeto: CRM Básico (MVP)

## 🎯 Objetivo
Criar um sistema de CRM simples para gerenciamento de contatos, interações e funil de vendas (pipeline), com backend em NestJS, banco Utilizar Supabase como somente banco de dados, e frontend em Next js.
Utilizar componentes ANTD com design bonito e moderno para aplicação de CRM; Nest js utilizar como api, seguindo seus melhores patterns e arquitetura, e banco de dados utilizar supabase;

---

## 🧱 Stack Tecnológica
- Backend: NestJS (TypeScript)
- Banco de dados: Supabase
- Frontend: Nest Js
- Estilo de arquitetura: REST API

---

## 📦 Funcionalidades (MVP)

### 1. Contatos (Contacts)
- Criar contato
- Listar contatos
- Atualizar contato
- Deletar contato
- Campos:
  - id
  - nome
  - email
  - telefone
  - empresa
  - observações
  - createdAt
  - createdBy
  - updatedAt
  - updatedBy

---

### 2. Empresas (Companies)
- Criar empresa
- Listar empresas
- Relacionar com contatos

---

### 3. Interações (Interactions)
- Registrar interação com contato
- Tipos: ligação, email, reunião
- Campos:
  - id
  - tipo
  - descrição
  - data
  - contactId

---

### 4. Funil de Vendas (Deals / Opportunities)
- Criar oportunidade
- Atualizar status
- Listar oportunidades
- Campos:
  - id
  - titulo
  - valor
  - status (LEAD, CONTACTED, PROPOSAL, NEGOTIATION, WON, LOST) -> ENUM
  - contactId
  - createdAt

---

### 5. Tarefas (Tasks)
- Criar tarefa
- Marcar como concluída
- Campos:
  - id
  - titulo
  - descrição
  - dataVencimento
  - status (PENDING, DONE)
  - contactId (opcional)
  - dealId (opcional)

### 6. Multi idioma
    - utilizar a internacionalização nativa do next js
    - Idioma Ingles e Portugues
    - Criar estrutura de idiomas e hooks para tradução nas páginas
    - Quando alterar o idioma no seletor de idioma, alterar o idioma do site se fazer requisições
    - Criar cache dos idiomas para evitar multiplas requisições

### 7. Banco de dados Supabase
    - Criar banco de dados com supabase e conecção com o nest js
    - Estruturar nest js para suportar o supabase

### 8. Autenticação
    - Utilizar autenticação next auth com conexão github e google (somente esses)
    - Validar autenticação no nest js

### 9. Criar perfis de usuário
    - Criar configuração de perfil (user, manager, adm)
    - Criar usuário system (padrão do sistema com perfil ADM)
    - Criar configuração onde consigo assosiar varios user em um manager
    - Cada usuário vê somente seus contatos etc
    - Manager consegue ver de todos os usuários associados a ele
    - Criar CRUD para grupo (associado ao manager)

### 10. Controle de Permissões (RBAC)

Você já tem perfis — agora precisa controlar o que cada um pode fazer.

    - Criar sistema de permissões:
    - USER → só próprios dados
    - MANAGER → dados do grupo
    - ADMIN → tudo
    - Implementar:
    - Guards no NestJS
    - Decorators tipo:
        @Roles('ADMIN')

### 11. Dashboard (KPIs)

Transforma seu CRM em ferramenta de decisão:

    - Total de leads
    - Negócios em aberto
    - Valor total no pipeline
    - Conversão (ganho/perdido)
    - utilizar gráficos bonitos e leves para ficar profissional

### 12. Notificações

Muito útil na prática:

    - Lembrete de tarefas
    - Follow-up atrasado
    - Novo lead

    Sugestões:

    - Toast no sistema

### 13. Agenda / Calendário

Ajuda MUITO no dia a dia:

    - Visualizar tarefas por data
    - Integração com interações

### 14. Filtros avançados

Pra escalar o uso:

     -Filtrar por:
     -status
     -responsável
     -data
     -Busca full-text

### 15. Multi-tenant (nível SaaS)

Cada empresa com seus dados isolados, pois o CRM pode ser usado para várias empresas
    - Então poderia ter um Cadastro de Empresa á nivel SAAS
Campo tipo:
    tenantId

### 16. Upload de arquivos

Muito útil:

Anexar arquivos em:
    - contatos
    - negociações

Pode usar:

    - Supabase Storage

### 17. Segurança básica

Essencial:

    - Rate limit
    - Helmet
    - CORS configurado
    - Validação forte no backend

### 18. SEO e SSR (Next.js)

Já que você está usando Next.js:

    - Metadata dinâmica
    - SSR nas páginas importantes

### 19. UX / Produto (diferencial real)

Aqui poucos pensam:

    - Kanban fluido (drag and drop) -> poderia usar o npm install @dnd-kit/react
    - Feedback visual (loading, success)
    - Interface rápida
    - usar componentes ANTD

---

## 🧠 Regras de Negócio
- Um contato pode ter várias interações
- Um contato pode ter várias oportunidades
- Uma oportunidade pertence a um contato
- Tarefas podem estar ligadas a contatos ou oportunidades
- Status de oportunidades deve seguir um fluxo de pipeline

---

## 🗄️ Modelagem Supabase (gerar automaticamente)
Criar models:
- Contact
- Company
- Interaction
- Deal
- Task

Com relacionamentos apropriados (1:N)

---

## ⚙️ Backend (NestJS)
Gerar:
- Módulos
- Controllers
- Services
- DTOs (Create e Update)
- Validação com class-validator
- Decorators de usuário logadao no sistema para utilização
- Validação JWT do token feito pelo front end
-

Endpoints REST padrão:
- GET /contacts
- POST /contacts
- PUT /contacts/:id
- DELETE /contacts/:id
(equivalente para outras entidades)

---

## 🎨 Frontend (Next JS)
Criar páginas:
- Lista de contatos
- Cadastro de contato
- Pipeline de vendas (estilo Kanban)
- Tela de detalhes do contato (com interações)
- Outras telas primordiais

---

## 📊 Pipeline (Kanban)
Colunas:
- LEAD
- CONTACTED
- PROPOSAL
- NEGOTIATION
- WON
- LOST

Permitir mover oportunidades entre colunas

---

## 🧪 Extras (se possível)
- Filtros por status
- Busca por nome/email
- Paginação
- Seed inicial no banco

---

## 🧼 Boas práticas
- Código limpo (Clean Code)
- Separação de responsabilidades
- Uso de DTOs
- Tratamento de erros
- Tipagem forte com TypeScript

---

## 📁 Estrutura esperada
/backend
  /src
    /modules
/frontend
  /src/app

---

## Dica importante (arquitetura madura)
### Use Supabase como:

DB + RLS + Storage

### Use NestJS como:

camada de negócio (regra, validação, segurança)

### Use Next.js como:

UI + SSR

## ✅ Objetivo final
Ter um CRM funcional com:
- CRUD completo
- Pipeline visual
- Relacionamento entre dados
- Código organizado e escalável
