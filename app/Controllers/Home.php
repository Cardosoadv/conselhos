<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        $data['titulo'] = 'Dashboard';
        return $this->loadView('dashboard2', $data);
    }
}
