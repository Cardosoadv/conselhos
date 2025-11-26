<?php

namespace App\Controllers;

use App\Models\ProfissionalModel;
use App\Models\ProfissaoModel;

/**
 * Controlador responsável pelo gerenciamento de Profissionais.
 */
class Profissionais extends BaseController
{
    /**
     * Instância do modelo de Profissional.
     *
     * @var ProfissionalModel
     */
    protected $profissionalModel;

    /**
     * Instância do modelo de Profissão.
     *
     * @var ProfissaoModel
     */
    protected $profissaoModel;

    /**
     * Construtor da classe.
     * Inicializa os modelos de Profissional e Profissão.
     */
    public function __construct()
    {
        $this->profissionalModel = new ProfissionalModel();
        $this->profissaoModel    = new ProfissaoModel();
    }

    /**
     * Exibe a lista de todos os profissionais cadastrados.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function index()
    {
        if (! auth()->user()->can('profissionais.listar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo'        => 'Profissionais',
            'profissionais' => $this->profissionalModel->findAll()
        ];

        return $this->loadView('profissionais/index', $data);
    }

    /**
     * Exibe o formulário para criar um novo profissional.
     *
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function new()
    {
        if (! auth()->user()->can('profissionais.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = [
            'titulo'     => 'Novo Profissional',
            'profissoes' => $this->profissaoModel->findAll()
        ];

        return $this->loadView('profissionais/form', $data);
    }

    /**
     * Processa a criação de um novo profissional.
     *
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissionais ou volta com erros.
     */
    public function create()
    {
        if (! auth()->user()->can('profissionais.criar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $data = $this->request->getPost();

        // Validação manual ou via model
        if (!$this->profissionalModel->validate($data)) {
            return redirect()->back()->withInput()->with('errors', $this->profissionalModel->errors());
        }

        // Upload da imagem
        $file = $this->request->getFile('foto');
        $filePath = null;

        // Primeiro salva para ter o ID para a pasta
        $id = $this->profissionalModel->insert($data);

        if ($id) {
            // Se salvou, processa a imagem e as profissões
            if ($file && $file->isValid() && ! $file->hasMoved()) {
                // Cria pasta com ID do profissional
                $path = 'uploads/profissionais/' . $id;

                // Garante que a pasta existe (embora move() crie)
                if (!is_dir(WRITEPATH . $path)) {
                    mkdir(WRITEPATH . $path, 0777, true);
                }

                $newName = $file->getRandomName();
                $file->move(WRITEPATH . $path, $newName);
                $filePath = $path . '/' . $newName;

                // Atualiza o registro com o caminho da foto
                $this->profissionalModel->update($id, ['foto' => $filePath]);
            }

            // Sincroniza profissões
            $profissoes = $this->request->getPost('profissoes') ?? [];
            $this->profissionalModel->syncProfissoes($id, $profissoes);

            return redirect()->to('/profissionais')->with('message', 'Profissional criado com sucesso.');
        } else {
            return redirect()->back()->withInput()->with('errors', $this->profissionalModel->errors());
        }
    }

    /**
     * Exibe o formulário para editar um profissional existente.
     *
     * @param int|string $id O ID do profissional.
     * @return string|\CodeIgniter\HTTP\RedirectResponse O conteúdo da view renderizada ou redirecionamento em caso de erro.
     */
    public function edit($id)
    {
        if (! auth()->user()->can('profissionais.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $profissional = $this->profissionalModel->find($id);

        if (!$profissional) {
            return redirect()->back()->with('error', 'Profissional não encontrado.');
        }

        // Busca profissões associadas
        $profissoesAssociadas = $this->profissionalModel->getProfissoes($id);
        $profissoesIds = array_column($profissoesAssociadas, 'id');

        $data = [
            'titulo'               => 'Editar Profissional',
            'profissional'         => $profissional,
            'profissoes'           => $this->profissaoModel->findAll(),
            'profissoesAssociadas' => $profissoesIds
        ];

        return $this->loadView('profissionais/form', $data);
    }

    /**
     * Processa a atualização de um profissional existente.
     *
     * @param int|string $id O ID do profissional.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissionais ou volta com erros.
     */
    public function update($id)
    {
        if (! auth()->user()->can('profissionais.editar')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $profissional = $this->profissionalModel->find($id);
        if (!$profissional) {
            return redirect()->back()->with('error', 'Profissional não encontrado.');
        }

        $data = $this->request->getPost();

        // Validação
        // Remove regra de unique se for o mesmo ID (já tratado no model com {id}, mas precisa passar o id no save/update)

        if (!$this->profissionalModel->update($id, $data)) {
            return redirect()->back()->withInput()->with('errors', $this->profissionalModel->errors());
        }

        // Upload da imagem
        $file = $this->request->getFile('foto');
        if ($file && $file->isValid() && ! $file->hasMoved()) {
            // Remove imagem antiga se existir
            if (!empty($profissional['foto']) && file_exists(WRITEPATH . $profissional['foto'])) {
                unlink(WRITEPATH . $profissional['foto']);
            }

            $path = 'uploads/profissionais/' . $id;
            if (!is_dir(WRITEPATH . $path)) {
                mkdir(WRITEPATH . $path, 0777, true);
            }

            $newName = $file->getRandomName();
            $file->move(WRITEPATH . $path, $newName);
            $filePath = $path . '/' . $newName;

            $this->profissionalModel->update($id, ['foto' => $filePath]);
        }

        // Sincroniza profissões
        $profissoes = $this->request->getPost('profissoes') ?? [];
        $this->profissionalModel->syncProfissoes($id, $profissoes);

        return redirect()->to('/profissionais')->with('message', 'Profissional atualizado com sucesso.');
    }

    /**
     * Exclui um profissional existente.
     *
     * @param int|string $id O ID do profissional.
     * @return \CodeIgniter\HTTP\RedirectResponse Redireciona para a lista de profissionais.
     */
    public function delete($id)
    {
        if (! auth()->user()->can('profissionais.excluir')) {
            return redirect()->to('/')->with('error', 'Acesso negado.');
        }

        $profissional = $this->profissionalModel->find($id);
        if ($profissional) {
            // Opcional: Deletar a pasta de imagens ou manter (Soft Delete mantém o registro, então talvez manter a imagem)
            // Como estamos usando SoftDelete no model, o delete() apenas marca deleted_at.
            $this->profissionalModel->delete($id);
        }

        return redirect()->to('/profissionais')->with('message', 'Profissional excluído com sucesso.');
    }

    /**
     * Exibe a foto do profissional.
     *
     * @param int|string $id O ID do profissional.
     * @return \CodeIgniter\HTTP\ResponseInterface A imagem ou erro 404.
     */
    public function foto($id)
    {
        $profissional = $this->profissionalModel->find($id);

        if (!$profissional || empty($profissional['foto'])) {
            // Retorna imagem padrão ou 404
            return $this->response->setStatusCode(404);
        }

        $path = WRITEPATH . $profissional['foto'];

        if (!file_exists($path)) {
            return $this->response->setStatusCode(404);
        }

        $mime = mime_content_type($path);
        header('Content-Type: ' . $mime);
        readfile($path);
        exit;
    }
}
