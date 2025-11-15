<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    // protected $session;

    /**
     * Array de variáveis necessárias para o layout.
     *
     * @var array<string, mixed>
     */
    protected $layoutData = [];

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        //Carregando os dados para o layout
        $this->layoutData = $this->getLayoutData();
    }

    /**
     * Obtém os dados necessários para o layout.
     *
     * @return array<string, mixed>
     */    
    protected function getLayoutData(): array
    {
        $data['mensagensNaoLidas'] =  [];
        $data['qteMensagensNaoLidas'] = 0;
        $data['qteTarefas'] = 0;
        $data['qteDespesasNaoPagas'] = 0;

        $data['notificacoes'] = $data['qteMensagensNaoLidas'] + $data['qteTarefas'] + $data['qteDespesasNaoPagas'];
        
        $data['logoEmpresa'] = base_url('public/dist/assets/img/default-150x150.png');
        $data['nomeEmpresa'] = 'Minha Empresa';
        
        return $data;
        
        // Exemplo de dados para o layout
        
    }


    /**
     * Método para carregar a view com os dados do layout.
     */
    public function loadView(string $view, array $data = []): string
    {
        // Mescla os dados do layout com os dados específicos da view
        $data = array_merge($this->layoutData, $data);
        return view($view, $data);
    }
}
