<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        $data['module'] = "Sem modulo";
        return view('welcome_message',$data);
    }
}
