<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UsersDadosModel;
use CodeIgniter\Shield\Models\UserModel;

/**
 * Controlador responsável pelo gerenciamento de Dados de Usuários.
 */
class Usuarios extends BaseController
{
    /**
     * Instância do modelo de Dados de Usuários.
     *
     * @var UsersDadosModel
     */
    private $usersDadosModel;

    /**
     * Instância do modelo de Usuários (Shield).
     *
     * @var UserModel
     */
    private $usersModel;

    /**
     * Construtor da classe.
     * Inicializa os modelos de Dados de Usuários e Usuários (Shield).
     */
    public function __construct()
    {
        $this->usersDadosModel = new UsersDadosModel();
        $this->usersModel = new UserModel();
    }

    /**
     * Exibe a lista de todos os usuários cadastrados.
     *
     * @return string O conteúdo da view renderizada.
     */
    public function index()
    {
        $dados['titulo'] = 'Dados de Usuários';
        $dados['usuarios'] = $this->usersDadosModel->findAll();

        return $this->loadView('users_dados/index', $dados);
    }

    /**
     * Exibe o formulário para criar um novo usuário (Redireciona para o Shield ou exibe erro).
     * Nota: A criação de usuários deve ser feita preferencialmente pelo Shield ou Admin.
     * Aqui mantemos para compatibilidade se necessário, mas o foco é editar dados de usuários existentes.
     *
     * @return string O conteúdo da view renderizada.
     */
    public function new()
    {
        // Opcional: Redirecionar para uma rota de registro do Shield ou manter formulário customizado
        $dados['titulo'] = 'Novo Usuário';
        return $this->loadView('users_dados/form', $dados);
    }

    /**
     * Processa a criação de um novo usuário (se aplicável).
     *
     * @return \CodeIgniter\HTTP\RedirectResponse
     */
    public function create()
    {
        // Implementação básica para criar registro em users_dados se o user_id for fornecido manualmente
        // Idealmente, cria-se o User no Shield primeiro.

        $rules = [
            'user_id' => 'required|integer|is_unique[users_dados.user_id]', // Garante um por usuário
            'nome'    => 'required|min_length[3]|max_length[100]',
            'imagem'  => 'permit_empty|is_image[imagem]|max_size[imagem,2048]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $data = $this->request->getPost();

        // Upload de imagem
        $img = $this->request->getFile('imagem');
        if ($img && $img->isValid() && !$img->hasMoved()) {
            $newName = $img->getRandomName();
            $userFolder = WRITEPATH . 'uploads/users/' . $data['user_id'];
            if (!is_dir($userFolder)) {
                mkdir($userFolder, 0777, true);
            }
            $img->move($userFolder, $newName);
            $data['imagem'] = $newName;
        }

        if ($this->usersDadosModel->save($data)) {
            return redirect()->to('/usuarios')->with('message', 'Dados do usuário criados com sucesso!');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->usersDadosModel->errors());
        }
    }

    /**
     * Exibe o formulário para editar os dados de um usuário.
     *
     * @param int|null $id O ID do usuário (tabela users).
     * @return string|\CodeIgniter\HTTP\RedirectResponse
     */
    public function edit($id = null)
    {
        if (!$id) {
            return redirect()->to('/usuarios')->with('error', 'ID de usuário inválido.');
        }

        // Busca dados existentes em users_dados
        $dadosUsuario = $this->usersDadosModel->getDadosByUserId($id);

        // Se não existir, busca dados básicos do User (Shield) para pré-preencher
        if (!$dadosUsuario) {
            $user = $this->usersModel->find($id);
            if (!$user) {
                return redirect()->to('/usuarios')->with('error', 'Usuário não encontrado.');
            }
            // Prepara array vazio com user_id preenchido e chaves padrão inicializadas
            $dadosUsuario = [
                'user_id'         => $id,
                'nome'            => $user->username ?? '', // Tenta usar username como nome inicial
                'cpf'             => '',
                'imagem'          => '',
                'data_nascimento' => '',
                'telefone'        => '',
                'cep'             => '',
                'logradouro'      => '',
                'numero'          => '',
                'bairro'          => '',
                'cidade'          => '',
                'estado'          => '',
            ];
        }

        $dados['titulo'] = 'Editar Dados do Usuário';
        $dados['usuario'] = $dadosUsuario;

        return $this->loadView('users_dados/form', $dados);
    }

    /**
     * Processa a atualização dos dados do usuário.
     *
     * @param int|null $id O ID do usuário (tabela users).
     * @return \CodeIgniter\HTTP\RedirectResponse
     */
    public function update($id = null)
    {
        if (!$id) {
            return redirect()->to('/usuarios')->with('error', 'ID de usuário inválido.');
        }

        $rules = [
            'nome'    => 'required|min_length[3]|max_length[100]',
            'imagem'  => 'permit_empty|is_image[imagem]|max_size[imagem,2048]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $data = $this->request->getPost();

        // Verifica se já existe registro para pegar o ID primário de users_dados
        $existing = $this->usersDadosModel->getDadosByUserId($id);
        if ($existing) {
            $data['id'] = $existing['id']; // Define ID para update
        } else {
            $data['user_id'] = $id; // Define user_id para insert
        }

        // Upload de imagem
        $img = $this->request->getFile('imagem');
        if ($img && $img->isValid() && !$img->hasMoved()) {
            // Remove imagem antiga se existir
            if ($existing && !empty($existing['imagem']) && file_exists(WRITEPATH . 'uploads/users/' . $id . '/' . $existing['imagem'])) {
                unlink(WRITEPATH . 'uploads/users/' . $id . '/' . $existing['imagem']);
            }

            $newName = $img->getRandomName();
            $userFolder = WRITEPATH . 'uploads/users/' . $id;
            if (!is_dir($userFolder)) {
                mkdir($userFolder, 0777, true);
            }
            $img->move($userFolder, $newName);
            $data['imagem'] = $newName;
        }

        if ($this->usersDadosModel->save($data)) {
            return redirect()->to('/usuarios')->with('message', 'Dados do usuário atualizados com sucesso!');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->usersDadosModel->errors());
        }
    }

    /**
     * Exclui os dados complementares de um usuário.
     *
     * @param int|null $id O ID do usuário (tabela users).
     * @return \CodeIgniter\HTTP\RedirectResponse
     */
    public function delete($id = null)
    {
        // Busca pelo user_id
        $dadosUsuario = $this->usersDadosModel->getDadosByUserId($id);

        if ($dadosUsuario) {
            // Remove imagem
            if (!empty($dadosUsuario['imagem']) && file_exists(WRITEPATH . 'uploads/users/' . $dadosUsuario['user_id'] . '/' . $dadosUsuario['imagem'])) {
                unlink(WRITEPATH . 'uploads/users/' . $dadosUsuario['user_id'] . '/' . $dadosUsuario['imagem']);
            }

            $this->usersDadosModel->delete($dadosUsuario['id']);
            return redirect()->to('/usuarios')->with('message', 'Dados do usuário excluídos com sucesso!');
        }

        return redirect()->to('/usuarios')->with('error', 'Dados não encontrados para este usuário.');
    }


    /**
     * Exibe a imagem do usuário armazenada na pasta writable.
     *
     * @param int $userId ID do usuário.
     * @param string $imagem Nome do arquivo da imagem.
     * @return \CodeIgniter\HTTP\ResponseInterface
     */
    public function mostrarImagem($userId, $imagem)
    {
        $path = WRITEPATH . 'uploads/users/' . $userId . '/' . $imagem;

        if (!file_exists($path)) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $mime = mime_content_type($path);
        header('Content-Type: ' . $mime);
        readfile($path);
        exit;
    }

    /**
     * Exibe o avatar do usuário (ou default).
     *
     * @param int $userId ID do usuário.
     * @return \CodeIgniter\HTTP\ResponseInterface
     */
    public function avatar($userId)
    {
        $dadosUsuario = $this->usersDadosModel->getDadosByUserId($userId);

        if ($dadosUsuario && !empty($dadosUsuario['imagem'])) {
            $path = WRITEPATH . 'uploads/users/' . $userId . '/' . $dadosUsuario['imagem'];
            if (file_exists($path)) {
                $mime = mime_content_type($path);
                header('Content-Type: ' . $mime);
                readfile($path);
                exit;
            }
        }

        // Se não tiver imagem ou arquivo não existir, tenta imagem padrão ou retorna 404
        // Ajuste o caminho da imagem padrão conforme necessário
        $defaultPath = ROOTPATH . 'public/dist/assets/img/default-150x150.png';
        if (file_exists($defaultPath)) {
            $mime = mime_content_type($defaultPath);
            header('Content-Type: ' . $mime);
            readfile($defaultPath);
            exit;
        }

        throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
    }
}
