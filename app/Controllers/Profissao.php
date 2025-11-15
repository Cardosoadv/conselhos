<?php

namespace App\Controllers;

use App\Models\ProfissaoModel;

class Profissao extends BaseController
{
    private $profissaoModel;

    public function __construct()
    {
        $this->profissaoModel = new ProfissaoModel();
    }

    public function create()
    {
        $dados = $this->request->getPost();
        $this->profissaoModel->save($dados);
        return redirect()->back();
    }

    public function delete($id = null)
    {
        $this->profissaoModel->delete($id);
        return redirect()->back();
    }
}
