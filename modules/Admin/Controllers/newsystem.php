<?php

namespace Modules\Admin\Controllers;

class newsystem extends \CodeIgniter\Controller
{
    public function index(): string
    {
        $data['module'] = "Admin";
        return view('welcome_message',$data);
    }
}
