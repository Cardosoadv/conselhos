# Gestão de Conselhos

Sistema administrativo para gerenciamento de conselhos e processos, estruturado em um formato Full-Stack (Frontend e Backend).

![Versão](https://img.shields.io/badge/Versão-1.3.1-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue)
![Express](https://img.shields.io/badge/Express-5.2-green)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-2-orange)

## Arquitetura do Projeto

O projeto adota uma arquitetura em duas grandes partes:

### 1. Backend (Express + Node.js)
Localizado na pasta `/backend`. O backend segue uma arquitetura restrita em camadas para melhor organização e escalabilidade:
- **Controllers:** Responsáveis estritamente por receber as requisições HTTP (Requests), repassar para os serviços e retornar as respostas (Responses).
- **Services:** Contém toda a lógica de negócios e as regras de aplicação.
- **Models:** Gerenciam a estrutura de dados, queries e o relacionamento direto com o banco de dados MySQL utilizando `mysql2`.

**Principais Tecnologias:** Express, TypeScript, MySQL (mysql2), JWT (jsonwebtoken), bcrypt.

### 2. Frontend (React + Vite)
Localizado na pasta `/frontend`. O frontend é um Single Page Application construído focado em componentes reutilizáveis, hooks customizados e otimização de estado.
- **Estrutura:** UI desenvolvida em React com rotas gerenciadas por React Router.
- **Estilização:** Utiliza Material-UI e Bootstrap 5.2 para os layouts visuais.
- **Integração API:** Conexão com o backend realizada via Axios.

**Principais Tecnologias:** React, TypeScript, Vite, Material-UI, Bootstrap 5.2, Axios.

## Como Executar

### Pré-requisitos
- Node.js e npm instalados.
- Banco de dados MySQL rodando.

### Configuração do Backend
1. Acesse o diretório: `cd backend`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env` (credenciais do banco de dados e JWT_SECRET).
4. Rode as migrations (caso existam): `npm run migrate`
5. Inicie o servidor de desenvolvimento: `npm run dev`

### Configuração do Frontend
1. Acesse o diretório: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Agentes de Desenvolvimento IA

O projeto possui diretrizes estabelecidas na pasta `.agents` para inteligências artificiais que ajudam a manter e evoluir o código:
- **CodeHealth:** Limpeza, refatoração e manutenção.
- **Davinci:** Descoberta e proposta de novas features (UX/Sistema).
- **Palette:** Otimização de micro-UX, acessibilidade e CSS.
- **Sentinel:** Verificação e aprimoramento de segurança.
- **Bolt:** Otimização de performance (React e Express).

Todos os agentes são instruídos a respeitar rigidamente o padrão de arquitetura estrita do Express em camadas e os padrões modernos do React.
