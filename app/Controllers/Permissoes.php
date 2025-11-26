<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\Shield\Models\UserModel;

/**
 * Controlador responsável pelo gerenciamento de Permissões.
 */
class Permissoes extends BaseController
{
    /**
     * Exibe a lista de usuários para gerenciamento de permissões.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function index()
    {
        // Verifica se o usuário atual tem permissão para gerenciar permissões
        if (! auth()->user()->can('permissoes.gerenciar')) {
            return redirect()->to('/')->with('error', 'Você não tem permissão para acessar esta página.');
        }

        $userModel      = new UserModel();
        $data['users']  = $userModel->findAll();
        $data['titulo'] = 'Permissões';

        return $this->loadView('permissoes/index', $data);
    }

    /**
     * Exibe a interface de gerenciamento de permissões para um usuário específico.
     *
     * @param int|string $userId O ID do usuário.
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function gerenciar($userId)
    {
        // Verifica permissão
        if (! auth()->user()->can('permissoes.gerenciar')) {
            return redirect()->to('/')->with('error', 'Você não tem permissão para acessar esta página.');
        }

        $userModel      = new UserModel();
        $user           = $userModel->findById($userId);

        if (! $user) {
            return redirect()->back()->with('error', 'Usuário não encontrado.');
        }

        // Obtém todas as permissões definidas no sistema
        $config = config('AuthGroups');
        $allPermissions = $config->permissions;

        // Agrupa permissões por módulo (ex: 'conselho', 'usuarios') para exibição
        $groupedPermissions = [];
        foreach ($allPermissions as $permission => $description) {
            $parts = explode('.', $permission);
            $module = ucfirst($parts[0]);
            $groupedPermissions[$module][] = [
                'permission' => $permission,
                'description' => $description,
                'has_permission' => $user->can($permission) // Verifica se o usuário tem essa permissão específica
            ];
        }

        $data = [
            'user'                      => $user,
            'groupedPermissions'        => $groupedPermissions,
            'titulo'                    => 'Gerenciar Permissões - ' . $user->username
        ];

        return $this->loadView('permissoes/gerenciar', $data);
    }

    /**
     * Salva as permissões atribuídas a um usuário.
     *
     * @param int|string $userId O ID do usuário.
     * @return \CodeIgniter\HTTP\RedirectResponse Redirecionamento com mensagem de sucesso ou erro.
     */
    public function salvar($userId)
    {
        if (! auth()->user()->can('permissoes.gerenciar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $userModel      = new UserModel();
        $user           = $userModel->findById($userId);

        if (! $user) {
            return redirect()->back()->with('error', 'Usuário não encontrado.');
        }

        // Recebe as permissões do formulário
        $permissions = $this->request->getPost('permissions') ?? [];

        // Usando syncPermissions
        try {
            $user->syncPermissions(...$permissions);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao salvar permissões: ' . $e->getMessage());
        }

        return redirect()->to('/permissoes')->with('message', 'Permissões atualizadas com sucesso.');
    }
}
