-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_vendas;
USE sistema_vendas;

-- Tabela de usuários para autenticação
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes (relacionamento 1:N com vendas)
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos (relacionamento N:N com vendas)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de vendas (relacionamento 1:N com clientes)
CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela de relacionamento N:N entre vendas e produtos
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

-- Inserção de dados de exemplo

-- Clientes
INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao@email.com', '(11) 99999-1111'),
('Maria Santos', 'maria@email.com', '(11) 99999-2222'),
('Pedro Oliveira', 'pedro@email.com', '(11) 99999-3333'),
('Ana Costa', 'ana@email.com', '(11) 99999-4444');

-- Produtos
INSERT INTO produtos (nome, preco, estoque) VALUES
('Notebook Dell', 2500.00, 10),
('Mouse Logitech', 80.00, 50),
('Teclado Mecânico', 350.00, 30),
('Monitor 24"', 800.00, 15),
('Impressora HP', 450.00, 8),
('Webcam HD', 200.00, 25),
('Headset Gamer', 180.00, 40),
('SSD 500GB', 300.00, 20);

-- Vendas de exemplo demonstrando relacionamentos
-- Venda 1: João compra Notebook + Mouse + Teclado
INSERT INTO vendas (cliente_id, total) VALUES (1, 2930.00);
INSERT INTO venda_produtos (venda_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 2500.00),
(1, 2, 1, 80.00),
(1, 3, 1, 350.00);

-- Venda 2: Maria compra Monitor + Webcam
INSERT INTO vendas (cliente_id, total) VALUES (2, 1000.00);
INSERT INTO venda_produtos (venda_id, produto_id, quantidade, preco_unitario) VALUES
(2, 4, 1, 800.00),
(2, 6, 1, 200.00);

-- Venda 3: Pedro compra vários periféricos
INSERT INTO vendas (cliente_id, total) VALUES (3, 1060.00);
INSERT INTO venda_produtos (venda_id, produto_id, quantidade, preco_unitario) VALUES
(3, 2, 2, 80.00),
(3, 7, 3, 180.00),
(3, 8, 2, 300.00);

-- Atualizar estoque após as vendas
UPDATE produtos SET estoque = estoque - 1 WHERE id = 1; -- Notebook
UPDATE produtos SET estoque = estoque - 3 WHERE id = 2; -- Mouse
UPDATE produtos SET estoque = estoque - 1 WHERE id = 3; -- Teclado
UPDATE produtos SET estoque = estoque - 1 WHERE id = 4; -- Monitor
UPDATE produtos SET estoque = estoque - 1 WHERE id = 6; -- Webcam
UPDATE produtos SET estoque = estoque - 3 WHERE id = 7; -- Headset
UPDATE produtos SET estoque = estoque - 2 WHERE id = 8; -- SSD

-- Usuário administrador padrão (senha: admin123)
-- Hash gerado com bcryptjs saltRounds=10
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@sistema.com', '$2a$10$/xh46mCRUoJxEKnI1FwEKerOCQpPvaC2AfHVrm6Qntwi5OZvTepcm', 'admin');

-- Usuário comum de exemplo (senha: user123)
INSERT INTO users (username, email, password, role) VALUES
('usuario', 'usuario@sistema.com', '$2a$10$RPuZa07Yjzmz/SgDa112pelwlO05Zt/ImbixlBu2o6q1cWbVAzGWi', 'user');