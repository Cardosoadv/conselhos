<?php

namespace App\Controllers;

/**
 * Controlador principal para a página inicial.
 */
class Home extends BaseController
{
    /**
     * Exibe a página inicial (Dashboard).
     *
     * @return string O conteúdo da view renderizada.
     */
    public function index(): string
    {
        $data['titulo'] = 'Dashboard';
        return $this->loadView('dashboard', $data);
    }
}
