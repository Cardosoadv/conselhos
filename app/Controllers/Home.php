<?php

namespace App\Controllers;

use App\Models\SystemModel;

class Home extends BaseController
{
    public function index(): string
    {
        $data['module'] = "Sem modulo";
        return view('welcome_message',$data);
    }
    public function getSystem(): string
    {
    $systemModel = new SystemModel();
    $data['menu'] = $systemModel->findAll();
    return view('dashboard',$data);
    }
}
