# Sistema de Vendas - Frontend com React + Vite ⚡

## Visão Geral
Interface web desenvolvida em **React com Vite** para demonstrar relacionamentos de banco de dados 1:N e N:N através de um sistema de vendas completo e otimizado.

## ⚡ Por que Vite?
- **Desenvolvimento mais rápido**: Hot Module Replacement (HMR) instantâneo
- **Build otimizado**: Empacotamento com Rollup
- **Configuração mínima**: Zero-config para projetos React
- **Suporte moderno**: ES Modules nativo no desenvolvimento

## Funcionalidades Implementadas

### 1. Relacionamento 1:N (Um para Muitos)
- **Cliente → Vendas**: Um cliente pode realizar múltiplas compras
- Implementado através da seleção de cliente no formulário de venda
- Cada venda é associada a apenas um cliente

### 2. Relacionamento N:N (Muitos para Muitos)  
- **Vendas ↔ Produtos**: Uma venda pode conter vários produtos, um produto pode estar em várias vendas
- Implementado através da seleção múltipla de produtos com quantidades
- Tabela intermediária `venda_produtos` gerencia o relacionamento

## Componentes Principais

### `NovaVenda.jsx`
Interface principal que demonstra ambos os relacionamentos:
- Seleção de cliente (relacionamento 1:N)
- Adição de múltiplos produtos com quantidades (relacionamento N:N)
- Cálculo automático de totais
- Validação de estoque em tempo real
- Interface otimizada com Vite

### `VendasList.jsx`
- Listagem de todas as vendas realizadas
- Visualização detalhada mostrando produtos de cada venda
- Demonstra como os relacionamentos são apresentados ao usuário

### `ClientesList.jsx` e `ProdutosList.jsx`
- CRUD completo para gestão de clientes e produtos
- Base de dados para os relacionamentos
- Interface responsiva e moderna

## Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar backend
Certifique-se de que o backend esteja rodando em `http://localhost:3001`

### 3. Executar aplicação (Desenvolvimento)
```bash
npm run dev
```

### 4. Build para produção
```bash
npm run build
```

### 5. Preview da build
```bash
npm run preview
```

A aplicação será aberta em `http://localhost:3000` com HMR instantâneo!

## Tecnologias Utilizadas
- **⚡ Vite** - Build tool ultrarrápido
- **React 18** - Interface de usuário com hooks
- **Axios** - Cliente HTTP para comunicação com API
- **CSS3** - Estilização responsiva
- **JavaScript ES6+** - Módulos ES nativos

## Estrutura do Projeto

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ClientesList.jsx    # CRUD de clientes
│   │   ├── ProdutosList.jsx    # CRUD de produtos  
│   │   ├── NovaVenda.jsx       # Interface principal (1:N e N:N)
│   │   └── VendasList.jsx      # Histórico de vendas
│   ├── services/
│   │   └── api.js              # Configuração Axios
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globais
│   ├── main.jsx                # Ponto de entrada
│   └── index.css               # Estilos base
├── index.html                  # HTML template
├── vite.config.js              # Configuração Vite
└── package.json                # Dependências e scripts
```

## Vantagens do Vite sobre Create React App

### ⚡ Performance de Desenvolvimento
- **HMR**: Atualizações instantâneas sem reload
- **Cold start**: Inicialização 10x mais rápida
- **Bundle splitting**: Carregamento sob demanda

### 🛠️ Build Otimizado
- **Rollup**: Empacotamento eficiente
- **Tree shaking**: Eliminação de código morto
- **Code splitting**: Chunks otimizados

### 📦 Configuração
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true
  }
})
```

## Scripts Disponíveis

```json
{
  "dev": "vite",           // Desenvolvimento com HMR
  "build": "vite build",   // Build para produção
  "preview": "vite preview" // Preview da build
}
```

## Demonstração dos Relacionamentos

### Exemplo Visual na Interface:
- **🧑‍💼 Seleção de Cliente**: Dropdown com relacionamento 1:N
- **📦 Produtos da Venda**: Lista dinâmica com relacionamento N:N
- **🔍 Detalhes da Venda**: Visualização completa dos relacionamentos

### Fluxo Otimizado:
1. **Desenvolvimento rápido** com Vite HMR
2. **Validações em tempo real** 
3. **Interface responsiva** e moderna
4. **Feedback visual** instantâneo

## Melhorias com Vite

- ✅ **Desenvolvimento 10x mais rápido**
- ✅ **HMR instantâneo** para mudanças CSS/JS
- ✅ **Build otimizado** para produção
- ✅ **Suporte nativo** a ES Modules
- ✅ **Configuração mínima** 
- ✅ **TypeScript ready** (se necessário)

Este frontend demonstra perfeitamente os relacionamentos 1:N e N:N com a performance e eficiência do Vite! ⚡