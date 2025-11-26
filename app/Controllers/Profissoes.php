<?php

namespace App\Controllers;

use App\Models\ProfissaoModel;

/**
 * Controlador responsável pelo gerenciamento de Profissões.
 */
class Profissoes extends BaseController
{
    /**
     * Instância do modelo de Profissão.
     *
     * @var ProfissaoModel
     */
    protected $profissaoModel;

    /**
     * Construtor da classe.
     * Inicializa o modelo de Profissão.
     */
    public function __construct()
    {
        $this->profissaoModel = new ProfissaoModel();
    }

    /**
     * Exibe a lista de todas as profissões cadastradas.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
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

    /**
     * Exibe o formulário para criar uma nova profissão.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
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

    /**
     * Processa a criação de uma nova profissão.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissões ou volta com erros.
     */
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

    /**
     * Exibe o formulário para editar uma profissão existente.
     *
     * @param int|string $id O ID da profissão.
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
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

    /**
     * Processa a atualização de uma profissão existente.
     *
     * @param int|string $id O ID da profissão.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissões ou volta com erros.
     */
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

    /**
     * Exclui uma profissão existente.
     *
     * @param int|string $id O ID da profissão.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissões.
     */
    public function delete($id)
    {
        if (! auth()->user()->can('profissoes.excluir')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $this->profissaoModel->delete($id);

        return redirect()->to('/profissoes')->with('message', 'Profissão excluída com sucesso.');
    }
}
