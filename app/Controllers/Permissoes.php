<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\Shield\Models\UserModel;

class Permissoes extends BaseController
{
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

        // Remove todas as permissões diretas do usuário antes de adicionar as novas
        // Nota: O método syncPermissions do Shield lidaria com isso, mas ele sincroniza com grupos geralmente.
        // Para permissões diretas, vamos usar o método do User entity.

        // Primeiro, limpamos as permissões existentes (diretas)
        // O Shield não tem um "removeAllPermissions", então precisamos ver o que ele tem.
        // O metodo syncPermissions não existe no User entity diretamente, mas sim addPermission/removePermission.

        // Estrategia: Pegar todas as permissoes possiveis, checar se o usuario tem, se tiver e não estiver no post, remove.
        // Se estiver no post e não tiver, adiciona.

        $config = config('AuthGroups');
        $allPermissions = array_keys($config->permissions);

        foreach ($allPermissions as $perm) {
            $shouldHave = in_array($perm, $permissions);
            $hasCurrently = $user->hasPermission($perm); // hasPermission checa diretas e de grupo?
            // Cuidado: $user->can() checa tudo. $user->hasPermission() checa apenas as diretas do usuario na tabela auth_permissions_users?
            // Verificando a documentação do Shield:
            // $user->addPermission('users.create');
            // $user->removePermission('users.create');
            // $user->syncPermissions(...$permissions); -> Este existe na Trait HasPermissions?

            // Vamos tentar usar syncPermissions se existir, senão fazemos manual.
            // A trait HasPermissions tem syncPermissions(string ...$permissions).

        }

        // Usando syncPermissions
        try {
            $user->syncPermissions(...$permissions);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao salvar permissões: ' . $e->getMessage());
        }

        return redirect()->to('/permissoes')->with('message', 'Permissões atualizadas com sucesso.');
    }
}
