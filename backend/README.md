# Sistema de Vendas - Backend

## Configuração do Banco de Dados

### 1. Instalar MySQL
Certifique-se de ter o MySQL instalado e rodando.

### 2. Criar o banco de dados
Execute o script SQL para criar as tabelas e dados de exemplo:

```bash
mysql -u root -p < database/schema.sql
```

Ou importe manualmente via phpMyAdmin ou MySQL Workbench.

### 3. Configurar variáveis de ambiente
Edite o arquivo `.env` com suas credenciais do MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=sistema_vendas
DB_PORT=3306
PORT=3001
```

## Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo desenvolvimento
```bash
npm run dev
```

### 3. Executar em produção
```bash
npm start
```

## Endpoints da API

### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Vendas
- `GET /api/vendas` - Listar todas as vendas
- `GET /api/vendas/:id` - Buscar venda por ID com produtos
- `POST /api/vendas` - Criar nova venda
- `DELETE /api/vendas/:id` - Deletar venda

## Relacionamentos Implementados

### 1:N (Um para Muitos)
- **Cliente → Vendas**: Um cliente pode ter várias vendas
- Implementado via chave estrangeira `cliente_id` na tabela `vendas`

### N:N (Muitos para Muitos)
- **Vendas ↔ Produtos**: Uma venda pode ter vários produtos, um produto pode estar em várias vendas
- Implementado via tabela intermediária `venda_produtos` com campos:
  - `venda_id` (FK para vendas)
  - `produto_id` (FK para produtos)
  - `quantidade`
  - `preco_unitario`

## Exemplo de Criação de Venda (N:N)

```json
POST /api/vendas
{
  "cliente_id": 1,
  "produtos": [
    {
      "produto_id": 1,
      "quantidade": 1,
      "preco_unitario": 2500.00
    },
    {
      "produto_id": 2,
      "quantidade": 2,
      "preco_unitario": 80.00
    }
  ]
}
```

## Estrutura do Projeto

```
backend/
├── config/
│   └── database.js         # Configuração MySQL
├── models/
│   ├── Cliente.js          # Model Cliente
│   ├── Produto.js          # Model Produto
│   └── Venda.js            # Model Venda (com relacionamentos)
├── routes/
│   ├── clientes.js         # Rotas CRUD clientes
│   ├── produtos.js         # Rotas CRUD produtos
│   └── vendas.js           # Rotas CRUD vendas
├── database/
│   └── schema.sql          # Script de criação do banco
├── .env                    # Variáveis de ambiente
├── server.js               # Servidor principal
└── package.json            # Dependências e scripts
```