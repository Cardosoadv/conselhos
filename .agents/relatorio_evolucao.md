# Relatório de Evolução do Projeto Conselhos

**Versão atual:** 1.1.0

## Histórico de Versões

### v1.1.0 - 20/06/2026
- **Autenticação:** Implementação completa de sistema de registro e login.
- **Backend:** Conexão com MySQL (`mysql2`), senhas hash (`bcrypt`), geração e validação de JWT, rotas de auth (`/api/auth/login`, `/register`, `/me`).
- **Frontend:** Criação das páginas Login e Register, `AuthContext` para gerenciamento de estado global, proteção de rotas e integração com `axios` via interceptors.

### v1.0.0 - 19/06/2026
- **Configuração Inicial:** Inicialização do projeto base.
- **Backend:** Criação do ambiente com Express.js, TypeScript e Nodemon na porta 3000.
- **Frontend:** Criação do ambiente React com Vite, TypeScript, Bootstrap 5.2, Material-UI, React Router e configuração do `style.css` administrativo.
- **Integração:** Adotada a estrutura do "front" administrativo original (sidebar, topbar, dashboard).
