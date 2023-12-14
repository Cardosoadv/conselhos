<?php

namespace Modules\Admin\Controllers;

use App\Models\SystemModel;

class Home extends \CodeIgniter\Controller
{
    public function index(): string
    {
        $data['module'] = "Admin";
        return view('dashboard',$data);
    }
    
    public function System(): string
    {
    $systemModel = new SystemModel();
    $data['menu'] = $systemModel->findAll();
    return view('dashboard',$data);
    }
}
