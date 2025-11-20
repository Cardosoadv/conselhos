<?php

namespace App\Controllers;

use App\Models\ConselhoModel;

class Conselho extends BaseController
{
    private $conselhoModel;

    public function __construct()
    {
        $this->conselhoModel = new ConselhoModel();
    }

    public function index()
    {
        $dados = $this->conselhoModel->findAll();
        $dados['titulo'] = 'Conselhos';
        return $this->loadView('conselho/index', $dados);
    }

    public function new()
    {
        $dados['titulo'] = 'Novo Conselho';
        return $this->loadView('conselho/form', $dados);
    }

    public function create()
    {
        $dados = $this->request->getPost();
        $this->conselhoModel->save($dados);
        return redirect()->to('conselho');
    }

    public function edit($id = null)
    {
        $dados = $this->conselhoModel->find($id);
        $dados['titulo'] = 'Editar Conselho';
        return $this->loadView('conselho/form', $dados);
    }

    public function update($id = null)
    {
        $dados = $this->request->getPost();
        $this->conselhoModel->update($id, $dados);
        return redirect()->to('conselho');
    }

    public function delete($id = null)
    {
        $this->conselhoModel->delete($id);
        return redirect()->to('conselho');
    }
}
