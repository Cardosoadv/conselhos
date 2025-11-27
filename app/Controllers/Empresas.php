<?php

namespace App\Controllers;

use App\Models\EmpresaModel;

/**
 * Controlador responsável pelo gerenciamento de Empresas.
 */
class Empresas extends BaseController
{
    /**
     * Instância do modelo de Empresa.
     *
     * @var EmpresaModel
     */
    protected $empresaModel;

    /**
     * Construtor da classe.
     * Inicializa o modelo de Empresa.
     */
    public function __construct()
    {
        $this->empresaModel = new EmpresaModel();
    }

    /**
     * Exibe a lista de todas as empresas cadastradas.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function index()
    {
        if (! auth()->user()->can('empresas.listar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo'   => 'Empresas',
            'empresas' => $this->empresaModel->findAll()
        ];

        return $this->loadView('empresas/index', $data);
    }

    /**
     * Exibe o formulário para criar uma nova empresa.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function new()
    {
        if (! auth()->user()->can('empresas.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo' => 'Nova Empresa'
        ];

        return $this->loadView('empresas/form', $data);
    }

    /**
     * Processa a criação de uma nova empresa.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de empresas ou volta com erros.
     */
    public function create()
    {
        if (! auth()->user()->can('empresas.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        // Validação via model
        if (!$this->empresaModel->save($data)) {
            return redirect()->back()->withInput()->with('errors', $this->empresaModel->errors());
        }

        $id = $this->empresaModel->getInsertID();

        // Upload do logo
        $file = $this->request->getFile('logo');
        if ($file && $file->isValid() && ! $file->hasMoved()) {
            $path = 'uploads/empresas/' . $id;

            if (!is_dir(WRITEPATH . $path)) {
                mkdir(WRITEPATH . $path, 0777, true);
            }

            $newName = $file->getRandomName();
            $file->move(WRITEPATH . $path, $newName);
            $filePath = $path . '/' . $newName;

            $this->empresaModel->update($id, ['logo' => $filePath]);
        }

        return redirect()->to('/empresas')->with('message', 'Empresa criada com sucesso.');
    }

    /**
     * Exibe o formulário para editar uma empresa existente.
     *
     * @param int|string $id O ID da empresa.
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function edit($id)
    {
        if (! auth()->user()->can('empresas.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $empresa = $this->empresaModel->find($id);

        if (!$empresa) {
            return redirect()->back()->with('error', 'Empresa não encontrada.');
        }

        $data = [
            'titulo'  => 'Editar Empresa',
            'empresa' => $empresa
        ];

        return $this->loadView('empresas/form', $data);
    }

    /**
     * Processa a atualização de uma empresa existente.
     *
     * @param int|string $id O ID da empresa.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de empresas ou volta com erros.
     */
    public function update($id)
    {
        if (! auth()->user()->can('empresas.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $empresa = $this->empresaModel->find($id);
        if (!$empresa) {
            return redirect()->back()->with('error', 'Empresa não encontrada.');
        }

        $data = $this->request->getPost();

        // Garante que o ID está nos dados para validação correta (especialmente unique)
        $data['id'] = $id;

        if (!$this->empresaModel->save($data)) {
            return redirect()->back()->withInput()->with('errors', $this->empresaModel->errors());
        }

        // Upload do logo
        $file = $this->request->getFile('logo');
        if ($file && $file->isValid() && ! $file->hasMoved()) {
            // Remove logo antigo se existir
            if (!empty($empresa['logo']) && file_exists(WRITEPATH . $empresa['logo'])) {
                unlink(WRITEPATH . $empresa['logo']);
            }

            $path = 'uploads/empresas/' . $id;
            if (!is_dir(WRITEPATH . $path)) {
                mkdir(WRITEPATH . $path, 0777, true);
            }

            $newName = $file->getRandomName();
            $file->move(WRITEPATH . $path, $newName);
            $filePath = $path . '/' . $newName;

            $this->empresaModel->update($id, ['logo' => $filePath]);
        }

        return redirect()->to('/empresas')->with('message', 'Empresa atualizada com sucesso.');
    }

    /**
     * Exclui uma empresa existente.
     *
     * @param int|string $id O ID da empresa.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de empresas.
     */
    public function delete($id)
    {
        if (! auth()->user()->can('empresas.excluir')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $empresa = $this->empresaModel->find($id);
        if ($empresa) {
            $this->empresaModel->delete($id);
        }

        return redirect()->to('/empresas')->with('message', 'Empresa excluída com sucesso.');
    }

    /**
     * Exibe o logo da empresa.
     *
     * @param int|string $id O ID da empresa.
     * @return \CodeIgniter\HTTP\ResponseInterface A imagem ou erro 404.
     */
    public function logo($id)
    {
        $empresa = $this->empresaModel->find($id);

        if (!$empresa || empty($empresa['logo'])) {
            return $this->response->setStatusCode(404);
        }

        $path = WRITEPATH . $empresa['logo'];

        if (!file_exists($path)) {
            return $this->response->setStatusCode(404);
        }

        $mime = mime_content_type($path);
        header('Content-Type: ' . $mime);
        readfile($path);
        exit;
    }
}
