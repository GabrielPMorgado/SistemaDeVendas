# Sistema de Vendas com Autenticação JWT

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- **Login e Registro de usuários** com validação de dados
- **Autenticação JWT** com tokens seguros
- **Proteção de rotas** - apenas usuários autenticados podem acessar o sistema
- **Gerenciamento de roles** (admin/user)
- **Hash de senhas** com bcryptjs para segurança
- **Middleware de autenticação** para proteger endpoints da API

### ✅ Relacionamentos de Banco de Dados
- **1:N (Um para Muitos)**: Cliente → Vendas
- **N:N (Muitos para Muitos)**: Vendas ↔ Produtos (através da tabela `venda_produtos`)

### ✅ Interface de Usuário
- **Tela de Login/Registro** com design moderno e responsivo
- **Cabeçalho com informações do usuário** e botão de logout
- **Proteção de rotas** no frontend com componente ProtectedRoute
- **Contexto de autenticação** para gerenciar estado global do usuário

## 🏗️ Estrutura do Projeto

### Backend (Node.js + Express)
```
backend/
├── config/
│   └── database.js          # Configuração do MySQL
├── middleware/
│   └── auth.js              # Middleware de autenticação JWT
├── models/
│   ├── User.js              # Modelo de usuário com hash de senhas
│   ├── Cliente.js           # Modelo de cliente
│   ├── Produto.js           # Modelo de produto
│   └── Venda.js             # Modelo de venda (N:N com produtos)
├── routes/
│   ├── auth.js              # Rotas de autenticação (login/register)
│   ├── clientes.js          # CRUD de clientes
│   ├── produtos.js          # CRUD de produtos
│   └── vendas.js            # CRUD de vendas com produtos
├── database/
│   └── schema.sql           # Schema atualizado com tabela users
├── .env                     # Variáveis de ambiente (JWT_SECRET)
└── server.js                # Servidor principal
```

### Frontend (React + Vite)
```
frontend/src/
├── contexts/
│   └── AuthContext.jsx     # Contexto global de autenticação
├── components/
│   ├── Login.jsx           # Tela de login/registro
│   ├── Login.css           # Estilos da tela de login
│   ├── Header.jsx          # Cabeçalho com info do usuário
│   ├── Header.css          # Estilos do cabeçalho
│   ├── ProtectedRoute.jsx  # Componente para proteger rotas
│   ├── ClientesList.jsx    # Lista de clientes
│   ├── ProdutosList.jsx    # Lista de produtos
│   ├── NovaVenda.jsx       # Formulário de nova venda
│   └── VendasList.jsx      # Lista de vendas
├── services/
│   └── api.js              # Cliente HTTP com interceptors JWT
└── App.jsx                 # App principal com proteção de rotas
```

## 🗄️ Schema do Banco de Dados

### Nova Tabela: users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Relacionamento N:N (já existente)
```sql
-- Tabela de relacionamento entre vendas e produtos
CREATE TABLE venda_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_venda_produto (venda_id, produto_id)
);
```

## 🔐 Endpoints de Autenticação

### POST `/api/auth/register`
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### POST `/api/auth/login`
```json
{
  "email": "string",
  "password": "string"
}
```

### GET `/api/auth/verify`
Verifica se o token JWT é válido (requer Authorization header)

### GET `/api/auth/profile`
Retorna informações do usuário atual (requer autenticação)

## 👤 Usuários de Teste

### Administrador
- **Email**: admin@sistema.com
- **Senha**: admin123
- **Role**: admin

### Usuário Comum
- **Email**: usuario@sistema.com
- **Senha**: user123
- **Role**: user

## 🛠️ Como Configurar e Executar

### 1. Configurar Banco de Dados
```bash
# 1. Instalar MySQL
# 2. Criar o banco de dados executando o arquivo schema.sql
mysql -u root -p < backend/database/schema.sql
```

### 2. Configurar Backend
```bash
cd backend
npm install
# Configurar .env com suas credenciais do MySQL
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Segurança Implementada

1. **Hash de Senhas**: Senhas são criptografadas com bcryptjs (salt rounds: 10)
2. **JWT Tokens**: Tokens seguros com expiração de 24h
3. **Middleware de Autenticação**: Todas as rotas protegidas verificam o token
4. **Validação de Dados**: Validação de entrada nos formulários
5. **HTTPS Ready**: Estrutura preparada para HTTPS em produção
6. **Role-based Access**: Diferentes níveis de acesso (admin/user)

## 📱 Funcionalidades da Interface

### Tela de Login
- Formulário responsivo com validação
- Alternância entre login e registro
- Exibição de credenciais de teste
- Feedback visual de erros
- Loading states

### Cabeçalho do Sistema
- Informações do usuário logado
- Badge de admin para administradores
- Botão de logout com confirmação
- Navegação entre seções

### Proteção de Rotas
- Redirecionamento automático para login se não autenticado
- Verificação de token expirado
- Loading screen durante verificação
- Mensagem de acesso negado para recursos admin

## 🚨 Resolução de Problemas

### Erro de Conexão com MySQL
Se você receber erro `ECONNREFUSED ::1:3306`:
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `mysql -u root -p`

### Token Inválido
- Tokens expiram em 24h
- Limpe o localStorage e faça login novamente
- Verifique se JWT_SECRET está configurado no `.env`

## 🎯 Próximos Passos Sugeridos

1. **Refresh Tokens**: Implementar tokens de renovação
2. **Recuperação de Senha**: Funcionalidade de reset via email
3. **Perfil do Usuário**: Página para editar dados pessoais
4. **Logs de Auditoria**: Registrar ações dos usuários
5. **Rate Limiting**: Prevenir ataques de força bruta
6. **Testes Automatizados**: Testes unitários e de integração