<?php

namespace App\Controllers;

use App\Models\ProfissaoModel;

class Profissoes extends BaseController
{
    protected $profissaoModel;

    public function __construct()
    {
        $this->profissaoModel = new ProfissaoModel();
    }

    public function index()
    {
        if (! auth()->user()->can('profissoes.listar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo'     => 'Profissões',
            'profissoes' => $this->profissaoModel->findAll()
        ];

        return $this->loadView('profissoes/index', $data);
    }

    public function new()
    {
        if (! auth()->user()->can('profissoes.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo' => 'Nova Profissão'
        ];

        return $this->loadView('profissoes/form', $data);
    }

    public function create()
    {
        if (! auth()->user()->can('profissoes.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        if ($this->profissaoModel->save($data)) {
            return redirect()->to('/profissoes')->with('message', 'Profissão criada com sucesso.');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->profissaoModel->errors());
        }
    }

    public function edit($id)
    {
        if (! auth()->user()->can('profissoes.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $profissao = $this->profissaoModel->find($id);

        if (!$profissao) {
            return redirect()->back()->with('error', 'Profissão não encontrada.');
        }

        $data = [
            'titulo'    => 'Editar Profissão',
            'profissao' => $profissao
        ];

        return $this->loadView('profissoes/form', $data);
    }

    public function update($id)
    {
        if (! auth()->user()->can('profissoes.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        if ($this->profissaoModel->update($id, $data)) {
            return redirect()->to('/profissoes')->with('message', 'Profissão atualizada com sucesso.');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->profissaoModel->errors());
        }
    }

    public function delete($id)
    {
        if (! auth()->user()->can('profissoes.excluir')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $this->profissaoModel->delete($id);

        return redirect()->to('/profissoes')->with('message', 'Profissão excluída com sucesso.');
    }
}
