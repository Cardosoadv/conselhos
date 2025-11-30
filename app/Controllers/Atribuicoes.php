<?php

namespace App\Controllers;

use App\Models\AtribuicaoModel;

/**
 * Controlador responsável pelo gerenciamento de Atribuições.
 */
class Atribuicoes extends BaseController
{
    /**
     * Instância do modelo de Atribuição.
     *
     * @var AtribuicaoModel
     */
    protected $atribuicaoModel;

    /**
     * Construtor da classe.
     * Inicializa o modelo de Atribuição.
     */
    public function __construct()
    {
        $this->atribuicaoModel = new AtribuicaoModel();
    }

    /**
     * Exibe a lista de todas as atribuições cadastradas.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function index()
    {
        if (! auth()->user()->can('atribuicoes.listar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo'      => 'Atribuições',
            'atribuicoes' => $this->atribuicaoModel->findAll()
        ];

        return $this->loadView('atribuicoes/index', $data);
    }

    /**
     * Exibe o formulário para criar uma nova atribuição.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function new()
    {
        if (! auth()->user()->can('atribuicoes.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo' => 'Nova Atribuição'
        ];

        return $this->loadView('atribuicoes/form', $data);
    }

    /**
     * Processa a criação de uma nova atribuição.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de atribuições ou volta com erros.
     */
    public function create()
    {
        if (! auth()->user()->can('atribuicoes.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        if ($this->atribuicaoModel->save($data)) {
            return redirect()->to('/atribuicoes')->with('message', 'Atribuição criada com sucesso.');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->atribuicaoModel->errors());
        }
    }

    /**
     * Exibe o formulário para editar uma atribuição existente.
     *
     * @param int|string $id O ID da atribuição.
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function edit($id)
    {
        if (! auth()->user()->can('atribuicoes.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $atribuicao = $this->atribuicaoModel->find($id);

        if (!$atribuicao) {
            return redirect()->back()->with('error', 'Atribuição não encontrada.');
        }

        $data = [
            'titulo'     => 'Editar Atribuição',
            'atribuicao' => $atribuicao
        ];

        return $this->loadView('atribuicoes/form', $data);
    }

    /**
     * Processa a atualização de uma atribuição existente.
     *
     * @param int|string $id O ID da atribuição.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de atribuições ou volta com erros.
     */
    public function update($id)
    {
        if (! auth()->user()->can('atribuicoes.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        if ($this->atribuicaoModel->update($id, $data)) {
            return redirect()->to('/atribuicoes')->with('message', 'Atribuição atualizada com sucesso.');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->atribuicaoModel->errors());
        }
    }

    /**
     * Exclui uma atribuição existente.
     *
     * @param int|string $id O ID da atribuição.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de atribuições.
     */
    public function delete($id)
    {
        if (! auth()->user()->can('atribuicoes.excluir')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $this->atribuicaoModel->delete($id);

        return redirect()->to('/atribuicoes')->with('message', 'Atribuição excluída com sucesso.');
    }
}
