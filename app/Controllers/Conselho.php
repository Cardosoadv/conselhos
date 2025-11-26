<?php

namespace App\Controllers;

use App\Models\ConselhoModel;

/**
 * Controlador responsável pelo gerenciamento de Conselhos.
 */
/**
 * Controlador responsável pelo gerenciamento de Conselhos.
 */
class Conselho extends BaseController
{
    /**
     * Instância do modelo de Conselho.
     *
     * @var ConselhoModel
     */
    private $conselhoModel;

    /**
     * Construtor da classe.
     * Inicializa o modelo de Conselho.
     */
    public function __construct()
    {
        $this->conselhoModel = new ConselhoModel();
    }

    /**
     * Exibe a lista de todos os conselhos.
     *
     * @return string O conteúdo da view renderizada.
     */
    public function index()
    {
        $dados['conselhos'] = $this->conselhoModel->findAll();
        $dados['titulo'] = 'Conselhos';
        return $this->loadView('conselho/index', $dados);
    }

    /**
     * Exibe o formulário para criar um novo conselho.
     *
     * @return string O conteúdo da view renderizada.
     */
    public function new()
    {
        $dados['titulo'] = 'Novo Conselho';
        return $this->loadView('conselho/form', $dados);
    }

    /**
     * Processa a criação de um novo conselho.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de conselhos.
     */
    public function create()
    {
        $dados = $this->request->getPost();
        $this->conselhoModel->save($dados);
        return redirect()->to('conselho');
    }

    /**
     * Exibe o formulário para editar um conselho existente.
     *
     * @param int|null $id O ID do conselho a ser editado.
     * @return string O conteúdo da view renderizada.
     */
    public function edit($id = null)
    {
        $dados = $this->conselhoModel->find($id);
        $dados['titulo'] = 'Editar Conselho';
        return $this->loadView('conselho/form', $dados);
    }

    /**
     * Processa a atualização de um conselho existente.
     *
     * @param int|null $id O ID do conselho a ser atualizado.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de conselhos.
     */
    public function update($id = null)
    {
        $dados = $this->request->getPost();
        $this->conselhoModel->update($id, $dados);
        return redirect()->to('conselho');
    }

    /**
     * Exclui um conselho existente.
     *
     * @param int|null $id O ID do conselho a ser excluído.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de conselhos.
     */
    public function delete($id = null)
    {
        $this->conselhoModel->delete($id);
        return redirect()->to('conselho');
    }
}
