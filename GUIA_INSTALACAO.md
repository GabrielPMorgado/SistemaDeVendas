# 🚀 Guia de Instalação e Execução - Sistema de Vendas

## Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL (versão 8 ou superior)
- Git (opcional)

## 📋 Passo a Passo para Executar

### 1️⃣ Configurar o Banco de Dados MySQL

1. **Abrir MySQL Command Line ou phpMyAdmin**

2. **Executar o script SQL:**
```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sistema_vendas;
USE sistema_vendas;

-- Criar tabelas
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS venda_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_venda_produto (venda_id, produto_id)
);

-- Inserir dados de exemplo
INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao@email.com', '(11) 99999-1111'),
('Maria Santos', 'maria@email.com', '(11) 99999-2222'),
('Pedro Oliveira', 'pedro@email.com', '(11) 99999-3333'),
('Ana Costa', 'ana@email.com', '(11) 99999-4444');

INSERT INTO produtos (nome, preco, estoque) VALUES
('Notebook Dell', 2500.00, 10),
('Mouse Logitech', 80.00, 50),
('Teclado Mecânico', 350.00, 30),
('Monitor 24"', 800.00, 15),
('Impressora HP', 450.00, 8),
('Webcam HD', 200.00, 25),
('Headset Gamer', 180.00, 40),
('SSD 500GB', 300.00, 20);
```

### 2️⃣ Configurar o Backend

1. **Abrir terminal e navegar para a pasta backend:**
```bash
cd backend
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Configurar arquivo .env (editar se necessário):**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_DATABASE=sistema_vendas
DB_PORT=3306
PORT=3001
```

4. **Executar o backend:**
```bash
npm run dev
```

✅ **Backend rodará em:** http://localhost:3001

### 3️⃣ Configurar o Frontend

1. **Abrir NOVO terminal e navegar para a pasta frontend:**
```bash
cd frontend
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Executar o frontend:**
```bash
npm start
```

✅ **Frontend abrirá automaticamente em:** http://localhost:3000

## 🎯 Como Testar os Relacionamentos

### 1. **Gerenciar Dados Base**
- Acesse as abas "Clientes" e "Produtos"
- Adicione, edite ou remova clientes e produtos

### 2. **Criar Nova Venda (Relacionamentos)**
- Acesse "Nova Venda"
- **Relacionamento 1:N**: Selecione um cliente
- **Relacionamento N:N**: Adicione múltiplos produtos com quantidades
- Clique em "Registrar Venda"

### 3. **Visualizar Histórico**
- Acesse "Histórico"
- Clique em "Detalhes" para ver os relacionamentos
- Observe como uma venda conecta um cliente a vários produtos

## 🔧 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `sistema_vendas` foi criado

### Erro "Cannot resolve dependency"
```bash
# No frontend ou backend
rm -rf node_modules
npm install
```

### Porta já em uso
- Backend (3001): Altere PORT no arquivo `.env`
- Frontend (3000): O React perguntará se quer usar outra porta

## 📱 Funcionalidades Disponíveis

✅ **CRUD Completo**: Clientes e Produtos  
✅ **Nova Venda**: Interface principal demonstrando relacionamentos  
✅ **Histórico**: Visualização detalhada das vendas  
✅ **Validações**: Estoque, campos obrigatórios  
✅ **Feedback**: Mensagens de sucesso/erro  

## 🎉 Pronto!

Agora você pode testar o sistema completo que demonstra:
- **Relacionamento 1:N**: Cliente → Vendas
- **Relacionamento N:N**: Vendas ↔ Produtos

O sistema está totalmente funcional e segue as especificações da atividade!