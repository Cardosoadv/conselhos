# Sistema de Gerenciamento de Conselhos

Este repositório contém o código-fonte do Sistema de Gerenciamento de Conselhos, uma aplicação web desenvolvida em PHP utilizando o framework CodeIgniter 4.

## Visão Geral

O sistema tem como objetivo gerenciar conselhos profissionais, profissionais associados, profissões e dados de usuários. Ele oferece funcionalidades de CRUD (Create, Read, Update, Delete), controle de acesso baseado em permissões e validação de dados, incluindo CPF.

## Funcionalidades Principais

- **Gerenciamento de Conselhos:** Cadastro, edição e listagem de conselhos.
- **Gerenciamento de Profissionais:** Cadastro completo de profissionais, incluindo upload de foto e associação com múltiplas profissões.
- **Gerenciamento de Profissões:** Cadastro e manutenção de profissões.
- **Controle de Permissões:** Sistema granular de permissões por usuário e grupo (via CodeIgniter Shield).
- **Dados de Usuários:** Gerenciamento de dados complementares de usuários (CPF, endereço, foto, etc.).
- **Validação de CPF:** Validação customizada de CPF integrada ao sistema.

## Requisitos do Sistema

- PHP 7.4 ou superior (recomendado 8.1+)
- Extensão PHP `intl`
- Extensão PHP `mbstring`
- Extensão PHP `gd` (para manipulação de imagens)
- MySQL ou MariaDB
- Composer

## Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/conselhos.git
    cd conselhos
    ```

2.  **Instale as dependências:**

    ```bash
    composer install
    ```

3.  **Configure o ambiente:**

    Copie o arquivo `env` para `.env` e configure as variáveis de banco de dados e URL base:

    ```ini
    cp env .env
    ```

    Edite o arquivo `.env`:

    ```ini
    CI_ENVIRONMENT = development
    app.baseURL = 'http://localhost/conselhos'

    database.default.hostname = localhost
    database.default.database = nome_do_banco
    database.default.username = usuario
    database.default.password = senha
    database.default.DBDriver = MySQLi
    ```

4.  **Execute as migrações:**

    ```bash
    php spark migrate
    ```

5.  **Inicie o servidor de desenvolvimento:**

    ```bash
    php spark serve
    ```

    Acesse `http://localhost:8080` no seu navegador.

## Estrutura do Projeto

- `app/Controllers`: Controladores da aplicação (lógica de fluxo).
- `app/Models`: Modelos de dados (interação com o banco de dados).
- `app/Views`: Arquivos de visualização (HTML/PHP).
- `app/Traits`: Traits reutilizáveis (ex: `ValidarCpfTrait`).
- `app/Validation`: Regras de validação customizadas.
- `app/Config`: Arquivos de configuração (Rotas, Banco de Dados, etc.).

## Uso

### Usuários e Permissões

O sistema utiliza o CodeIgniter Shield para autenticação. Usuários podem ser gerenciados via banco de dados ou interface administrativa (se implementada). As permissões são definidas em `app/Config/AuthGroups.php` e podem ser atribuídas a grupos ou diretamente a usuários.

### Validação de CPF

A validação de CPF é feita através da regra `valid_cpf`, disponível globalmente. Ela utiliza a trait `App\Traits\ValidarCpfTrait`.

Exemplo de uso em um Model:

```php
protected $validationRules = [
    'cpf' => 'required|valid_cpf'
];
```

## Contribuição

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o Commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
