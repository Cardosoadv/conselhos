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
        return view('conselho/index', ['conselhos' => $dados]);
    }

    public function new()
    {
        return view('conselho/form');
    }

    public function create()
    {
        $dados = $this->request->getPost();
        $this->conselhoModel->save($dados);
        return redirect()->to('conselho');
    }

    public function edit($id = null)
    {
        $dado = $this->conselhoModel->find($id);
        return view('conselho/form', ['conselho' => $dado]);
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
