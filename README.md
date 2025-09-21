# Sistema de Vendas - Demonstração de Relacionamentos 1:N e N:N + Autenticação JWT

## Visão Geral do Projeto
Sistema completo desenvolvido para demonstrar relacionamentos de banco de dados através de uma aplicação prática de vendas, utilizando as tecnologias **Node.js**, **React** e **MySQL**, agora com **sistema completo de autenticação JWT** implementado.

## 🆕 NOVAS FUNCIONALIDADES
- ✅ **Sistema de Login/Registro** com validação
- ✅ **Autenticação JWT** com tokens seguros
- ✅ **Proteção de rotas** no frontend e backend
- ✅ **Gerenciamento de usuários** com roles (admin/user)
- ✅ **Interface moderna** com tela de login responsiva
- ✅ **Hash de senhas** com bcryptjs

## Relacionamentos Implementados

### 1:N (Um para Muitos)
- **Cliente → Vendas**: Um cliente pode realizar múltiplas compras
- Implementado via chave estrangeira `cliente_id` na tabela `vendas`

### N:N (Muitos para Muitos)
- **Vendas ↔ Produtos**: Uma venda pode conter vários produtos, um produto pode estar em várias vendas
- Implementado via tabela intermediária `venda_produtos`

## 🔐 Sistema de Autenticação

### Usuários de Teste
- **Admin**: admin@sistema.com / admin123
- **Usuário**: usuario@sistema.com / user123

### Endpoints de Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Perfil do usuário

### Segurança Implementada
- Hash de senhas com bcryptjs (salt rounds: 10)
- Tokens JWT com expiração de 24h
- Middleware de autenticação em todas as rotas protegidas
- Proteção de rotas no frontend com React Context

## Tecnologias Utilizadas
- **Backend**: Node.js, Express, MySQL2, JWT, bcryptjs, CORS, dotenv
- **Frontend**: React 18 + Vite ⚡, Axios, Context API, CSS3
- **Banco de Dados**: MySQL 8.0+
- **Autenticação**: JSON Web Tokens (JWT)

## Estrutura do Projeto

```
teste/
├── backend/              # API REST Node.js
│   ├── config/          # Configuração do banco
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas da API
│   ├── database/        # Scripts SQL
│   └── server.js        # Servidor principal
├── frontend/            # Interface React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── services/    # Cliente API
│   │   └── App.js       # App principal
│   └── public/
└── .github/
    └── copilot-instructions.md
```

## Instalação e Execução

### 1. Configurar Banco de Dados
```bash
# Executar script SQL para criar tabelas e dados
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
# Servidor rodará em http://localhost:3001
```

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev  # Com Vite - muito mais rápido! ⚡
# Interface rodará em http://localhost:3000
```

## Funcionalidades Principais

### Interface de Nova Venda
Demonstra ambos os relacionamentos em uma única tela:
- **Seleção de Cliente** (relacionamento 1:N)
- **Adição de Múltiplos Produtos** (relacionamento N:N)
- Validação de estoque em tempo real
- Cálculo automático de totais

### Gestão Completa
- CRUD de clientes e produtos
- Histórico detalhado de vendas
- Visualização dos relacionamentos

## Endpoints da API

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Vendas
- `GET /api/vendas` - Listar vendas
- `GET /api/vendas/:id` - Detalhes da venda
- `POST /api/vendas` - Criar venda (relacionamentos)
- `DELETE /api/vendas/:id` - Deletar venda

## Exemplo Prático dos Relacionamentos

### Criação de Venda (POST /api/vendas)
```json
{
  "cliente_id": 1,           // Relacionamento 1:N
  "produtos": [              // Relacionamento N:N
    {
      "produto_id": 1,
      "quantidade": 2,
      "preco_unitario": 2500.00
    },
    {
      "produto_id": 3,
      "quantidade": 1,
      "preco_unitario": 350.00
    }
  ]
}
```

### Resultado no Banco
```sql
-- Tabela vendas (1:N com cliente)
INSERT INTO vendas (cliente_id, total) VALUES (1, 5350.00);

-- Tabela venda_produtos (N:N)
INSERT INTO venda_produtos (venda_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 2500.00),
(1, 3, 1, 350.00);
```

## Características Técnicas

### Backend
- Transações MySQL para consistência de dados
- Validações de negócio (estoque, clientes, produtos)
- Tratamento de erros padronizado
- CORS configurado para desenvolvimento

### Frontend  
- Componentes React funcionais com hooks
- **Vite** para desenvolvimento ultrarrápido ⚡
- HMR (Hot Module Replacement) instantâneo
- Estado global gerenciado via useState
- Validações em tempo real
- Interface responsiva e intuitiva
- Feedback visual para todas as operações

### Banco de Dados
- Chaves estrangeiras com CASCADE
- Índices para otimização de consultas
- Dados de exemplo para testes
- Constraints para integridade referencial

## Como Testar os Relacionamentos

1. **Cadastrar dados base**: Criar alguns clientes e produtos
2. **Criar vendas**: Selecionar um cliente e múltiplos produtos
3. **Verificar relacionamentos**: Ver no histórico como uma venda conecta um cliente a vários produtos
4. **Testar validações**: Tentar exceder estoque ou criar venda sem produtos

## Conceitos Demonstrados

- **1:N em ação**: Um cliente aparece em múltiplas vendas
- **N:N em ação**: Produtos aparecem em diferentes vendas, vendas contêm vários produtos
- **Integridade referencial**: Não é possível criar venda com cliente/produto inexistente
- **Transações**: Vendas são criadas atomicamente (tudo ou nada)
- **Controle de estoque**: Produtos têm quantidade reduzida automaticamente

Este sistema serve como exemplo prático e completo de como implementar e utilizar relacionamentos de banco de dados em aplicações web modernas.