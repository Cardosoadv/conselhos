<?php

namespace App\Libraries;

/**
 * Classe Permissions
 *
 * Esta classe verifica as permissões do usuário para acessar diferentes módulos do sistema.
 */
class Permissions
{
    /**
     * Verifica as permissões do usuário logado.
     *
     * @return array Um array associativo com as permissões do usuário.
     */
    public function permission(): array
    {
        $permission['usuarios'] = true; // Acesso sempre permitido ao módulo de processos


        return $permission;
    }
}
