# 📦 Controle de Estoque - React Native

Aplicativo profissional de controle de estoque desenvolvido com **Expo SDK 53**, **React Native 0.79** e **TypeScript**. Arquitetura robusta e escalável, preparada para migração de banco de dados.

## 🚀 Características Principais

### ✨ Funcionalidades
- **CRUD completo de produtos** com campos detalhados
- **Sistema de categorização** com filtros avançados
- **Histórico de movimentações** (entradas e saídas)
- **Relatórios e análises** com métricas importantes
- **Alertas inteligentes** (estoque baixo, produtos vencendo)
- **Busca avançada** por nome e categoria
- **Temas claro e escuro** com troca dinâmica

### 🏗️ Arquitetura
- **Banco de dados local**: SQLite com Expo SQLite
- **Camada de abstração**: Preparada para migração (Supabase, Neon.tech)
- **Gerenciamento de estado**: Context API com hooks customizados
- **Navegação**: Expo Router com tab navigation
- **Estilização**: NativeWind (Tailwind CSS para React Native)
- **Tipagem completa**: TypeScript em 100% do código

### 🎨 Design System
- **Paleta de cores profissional** com suporte a tema escuro
- **Componentes reutilizáveis** (Button, Input, Card)
- **Ícones**: Lucide React Native
- **Animações suaves**: React Native Reanimated
- **Layout responsivo** otimizado para dispositivos móveis

## 📁 Estrutura do Projeto

```
/
├── app/                          # Telas (Expo Router)
│   ├── (tabs)/                  # Navegação por tabs
│   │   ├── index.tsx           # Lista de produtos
│   │   ├── analytics.tsx       # Relatórios e análises
│   │   ├── history.tsx         # Histórico de movimentações
│   │   └── settings.tsx        # Configurações
│   └── _layout.tsx             # Layout raiz
├── components/                  # Componentes reutilizáveis
│   ├── ui/                     # Componentes base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── ProductCard.tsx         # Card de produto
│   └── ProductForm.tsx         # Formulário de produto
├── contexts/                   # Context API
│   └── AppContext.tsx         # Estado global da aplicação
├── hooks/                      # Hooks customizados
│   ├── useDatabase.ts         # Hook para inicialização do DB
│   └── useFrameworkReady.ts   # Hook requerido pelo framework
├── services/                   # Camada de serviços
│   └── db/                    # Abstração do banco de dados
│       ├── index.ts           # Interface e gerenciador
│       ├── sqlite.ts          # Implementação SQLite
│       ├── supabase.ts        # Implementação Supabase (futuro)
│       └── neon.ts            # Implementação Neon (futuro)
├── types/                      # Definições TypeScript
│   └── index.ts               # Interfaces principais
├── scripts/                    # Scripts de desenvolvimento
│   └── seed-database.ts       # Popular banco com dados de exemplo
└── __tests__/                 # Testes unitários
    └── services/
        └── database.test.ts   # Testes do banco de dados
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Dispositivo móvel ou emulador

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>
cd controle-estoque-app

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Primeira Execução
O aplicativo irá automaticamente:
1. Criar o banco SQLite local
2. Criar as tabelas necessárias
3. Inserir categorias padrão

### Popular com Dados de Exemplo
```bash
# Executar script de população (opcional)
npx ts-node scripts/seed-database.ts
```

## 📊 Campos dos Produtos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Nome | string | ✅ | Nome do produto |
| Categoria | string | ✅ | Categoria do produto |
| Quantidade | number | ✅ | Quantidade em estoque |
| Preço de Compra | number | ✅ | Custo de aquisição |
| Preço de Venda | number | ✅ | Preço de venda |
| Data de Validade | string | ❌ | Data de validade (YYYY-MM-DD) |
| Observações | string | ❌ | Notas adicionais |

## 🔄 Migração de Banco de Dados

### Para Supabase

1. **Criar conta no Supabase**
   ```bash
   # Instalar SDK do Supabase
   npm install @supabase/supabase-js
   ```

2. **Configurar conexão**
   ```typescript
   // Atualizar services/db/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
   
   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

3. **Criar tabelas no Supabase**
   ```sql
   -- Execute no SQL Editor do Supabase
   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     category TEXT NOT NULL,
     quantity INTEGER NOT NULL DEFAULT 0,
     purchase_price DECIMAL NOT NULL DEFAULT 0,
     sale_price DECIMAL NOT NULL DEFAULT 0,
     expiration_date DATE,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE TABLE stock_movements (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id UUID REFERENCES products(id) ON DELETE CASCADE,
     type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
     quantity INTEGER NOT NULL,
     reason TEXT NOT NULL,
     date TIMESTAMP WITH TIME ZONE NOT NULL,
     notes TEXT
   );
   
   CREATE TABLE categories (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT UNIQUE NOT NULL,
     color TEXT NOT NULL
   );
   ```

4. **Alterar inicialização**
   ```typescript
   // No app/_layout.tsx ou onde inicializa o DB
   await dbManager.init({
     type: 'supabase',
     connectionString: 'YOUR_CONNECTION_STRING'
   });
   ```

### Para Neon.tech (PostgreSQL)

1. **Criar conta no Neon.tech**
   ```bash
   # Instalar SDK do Neon
   npm install @neondatabase/serverless
   ```

2. **Configurar conexão**
   ```typescript
   // Atualizar services/db/neon.ts
   import { neon } from '@neondatabase/serverless';
   
   const sql = neon('YOUR_DATABASE_URL');
   ```

3. **Criar tabelas** (mesmo SQL do Supabase)

4. **Alterar inicialização**
   ```typescript
   await dbManager.init({
     type: 'neon',
     connectionString: 'YOUR_NEON_DATABASE_URL'
   });
   ```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## 📱 Funcionalidades por Tela

### 🏠 **Produtos (Home)**
- Listagem de todos os produtos
- Estatísticas em tempo real
- Busca e filtros por categoria
- Alertas de estoque baixo
- Criação e edição de produtos
- Cards com informações detalhadas

### 📊 **Relatórios**
- Visão geral do estoque
- Valor total em estoque
- Lucro potencial e margem
- Estatísticas por categoria
- Alertas de produtos vencendo
- Movimentações recentes

### 📝 **Histórico**
- Lista todas as movimentações
- Filtros por tipo (entrada/saída)
- Criação de novas movimentações
- Histórico completo com timestamps
- Atualização automática do estoque

### ⚙️ **Configurações**
- Troca de tema (claro/escuro)
- Informações do banco de dados
- Opções de backup/restore (futuro)
- Informações sobre o aplicativo
- Limpeza de dados

## 🔧 Configurações Avançadas

### Variáveis de Ambiente
```bash
# .env (para configurações futuras)
DATABASE_TYPE=sqlite
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NEON_DATABASE_URL=your_neon_url
```

### Configuração do NativeWind
O projeto já está configurado com NativeWind. Para customizar:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Adicionar cores customizadas
      }
    },
  },
  plugins: [],
}
```

## 🚀 Build e Deploy

### Build para Produção
```bash
# Gerar build para Android
expo build:android

# Gerar build para iOS  
expo build:ios

# Build universal
expo build:web
```

### Deploy com EAS
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar projeto
eas build:configure

# Fazer build
eas build --platform all
```

## 📈 Próximas Funcionalidades

- [ ] **Autenticação de usuários**
- [ ] **Sincronização em nuvem**
- [ ] **Relatórios em PDF**
- [ ] **Código de barras/QR Code**
- [ ] **Notificações push**
- [ ] **Multi-loja/multi-usuário**
- [ ] **Integração com APIs de e-commerce**
- [ ] **Dashboard web**

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: [seu-email@exemplo.com]
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/repo/issues)
- 📖 Documentação: [Wiki do Projeto](https://github.com/seu-usuario/repo/wiki)

---

**Desenvolvido com ❤️ usando Expo, React Native e TypeScript**