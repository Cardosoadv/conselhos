# Sistema de Gerenciamento de Conselhos

Este é um sistema desenvolvido em PHP com CodeIgniter 4 para o gerenciamento de Conselhos e Dados de Usuários. O projeto foi estruturado para ser escalável, seguro e de fácil manutenção.

## Requisitos

- PHP 7.4 ou superior
- Extensão PHP `intl` ativada
- Extensão PHP `mbstring` ativada
- MySQL ou MariaDB
- Composer

## Instalação

1.  **Clone o repositório** (ou extraia os arquivos):

    ```bash
    git clone <url-do-repositorio>
    cd conselhos
    ```

2.  **Instale as dependências**:

    ```bash
    composer install
    ```

3.  **Configure o Banco de Dados**:

    - Copie o arquivo `env` para `.env`:

      ```bash
      cp env .env
      ```

      _(No Windows: `copy env .env`)_

    - Edite o arquivo `.env` e configure as credenciais do banco de dados:
      ```ini
      database.default.hostname = localhost
      database.default.database = nome_do_banco
      database.default.username = seu_usuario
      database.default.password = sua_senha
      database.default.DBDriver = MySQLi
      ```
    - Defina o ambiente para desenvolvimento (opcional, para ver erros):
      ```ini
      CI_ENVIRONMENT = development
      ```

4.  **Execute as Migrations**:

    ```bash
    php spark migrate
    ```

5.  **Inicie o Servidor de Desenvolvimento**:
    ```bash
    php spark serve
    ```
    O sistema estará acessível em `http://localhost:8080`.

## Funcionalidades

### Conselhos

- **Listagem**: Visualização de todos os conselhos cadastrados.
- **Cadastro**: Adição de novos conselhos com informações detalhadas (endereço, contato, etc.).
- **Edição**: Atualização dos dados dos conselhos.
- **Profissões**: Gerenciamento de profissões associadas a cada conselho.

### Dados de Usuários

- **Integração com Shield**: Vinculação com a tabela de usuários do CodeIgniter Shield.
- **Cadastro Completo**: Nome, CPF, Data de Nascimento, Telefone e Endereço.
- **Upload de Imagem**: Foto de perfil com validação.
- **CRUD Completo**: Listagem, criação, edição e exclusão de dados de usuários.

## Estrutura do Projeto e Documentação

O código fonte foi totalmente documentado seguindo os padrões PHPDoc. Cada classe, método e função possui docstrings explicativos em português.

- `app/Controllers`: Controladores da aplicação.
  - `Conselho.php`: Gerencia as ações relacionadas aos conselhos.
  - `Usuarios.php`: Gerencia os dados complementares dos usuários.
- `app/Models`: Modelos de dados.
  - `ConselhoModel.php`: Interação com a tabela `conselhos`.
  - `UsersDadosModel.php`: Interação com a tabela `users_dados`.
- `app/Views`: Arquivos de visualização (HTML/PHP).
  - `conselho/`: Views para o módulo de conselhos.
  - `users_dados/`: Views para o módulo de dados de usuários.
  - `template/`: Layout principal e cabeçalho.
- `app/Database/Migrations`: Arquivos de migração do banco de dados.
- `public/uploads`: Diretório para armazenamento de imagens de usuários.

## Tecnologias Utilizadas

- **CodeIgniter 4**: Framework PHP robusto e leve.
- **Bootstrap 5**: Framework CSS para o frontend responsivo.
- **FontAwesome**: Ícones vetoriais e logotipos sociais.
- **AdminLTE**: Tema do painel administrativo (se aplicável).
