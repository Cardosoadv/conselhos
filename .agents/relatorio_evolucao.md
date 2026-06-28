# Relatório de Evolução do Projeto Conselhos

**Versão atual:** 1.3.0

## Histórico de Versões

### v1.3.0 - 27/06/2026
- **Feature Profissões:** Implementação do módulo de Cadastro de Profissões (CRUD completo).
- **Backend:** Criação das migrations (`0003_atribuicoes.ts`, `0004_professions.ts`), model, controller e service seguindo a arquitetura em camadas. Rota `/api/professions` registrada.
- **Frontend:** Criação da página `Professions.tsx`, serviço `professionService.ts` via Axios e link no menu lateral (`App.tsx`).
- **Automação:** Correção de erros no `start.ts` (ajustes para ES Modules, tipagem e fechamento de blocos) e instalação de dependência `@types/node`.

### v1.2.2 - 22/06/2026
- **Agentes:** Atualização generalizada das skills dos agentes (CodeHealth, Davinci, Palette, Sentinel e Bolt) para corresponder ao stack atual do projeto (Express + React). Inserida a regra de arquitetura estrita do backend em camadas (Controllers, Services e Models) e o uso de componentes/hooks no frontend React.

### v1.2.1 - 22/06/2026
- **Agentes:** Atualização das skills do agente Bolt para corresponder ao stack atual do projeto (Express + React).

### v1.2.0 - 21/06/2026
- **Configuração do Sistema:** Criação de módulo para gerenciar as configurações gerais e dados cadastrais da entidade (Sistema de Profissões, Nível, Razão Social, CNPJ, Endereço e Contatos).
- **Backend:** Adicionada tabela `settings`, rota de API protegida (`/api/settings`) e função validadora de CNPJ alfanumérico.
- **Frontend:** Nova página `Settings` estruturada em abas, validação de CNPJ, integração com API e novo atalho na barra lateral.

### v1.1.4 - 21/06/2026
- **Configuração:** Geração de secret aleatório para o `JWT_SECRET` no arquivo `.env` do backend.

### v1.1.3 - 21/06/2026
- **Backend:** Refatoração do `authController.ts` para utilizar as funções do `userModel.ts` em todas as transações com o banco de dados (register, login, getMe).

### v1.1.2 - 21/06/2026
- **Banco de Dados:** Criação de script `migrate.ts` para execução de migrations pendentes, correção da tabela de migrations no `db.ts` e ajuste na sintaxe e tipagem da migration de usuários (`0001_user.ts`).

### v1.1.1 - 21/06/2026
- **Backend:** Correção de tipagem no `userModel.ts` para compatibilidade com `RowDataPacket` do `mysql2` e ajuste no retorno da função de atualização (`updateUser`).

### v1.1.0 - 20/06/2026
- **Autenticação:** Implementação completa de sistema de registro e login.
- **Backend:** Conexão com MySQL (`mysql2`), senhas hash (`bcrypt`), geração e validação de JWT, rotas de auth (`/api/auth/login`, `/register`, `/me`).
- **Frontend:** Criação das páginas Login e Register, `AuthContext` para gerenciamento de estado global, proteção de rotas e integração com `axios` via interceptors.

### v1.0.0 - 19/06/2026
- **Configuração Inicial:** Inicialização do projeto base.
- **Backend:** Criação do ambiente com Express.js, TypeScript e Nodemon na porta 3000.
- **Frontend:** Criação do ambiente React com Vite, TypeScript, Bootstrap 5.2, Material-UI, React Router e configuração do `style.css` administrativo.
- **Integração:** Adotada a estrutura do "front" administrativo original (sidebar, topbar, dashboard).
