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
 * BaseController fornece um local conveniente para carregar componentes
 * e executar funções que são necessárias por todos os seus controladores.
 * Estenda esta classe em qualquer novo controlador:
 *     class Home extends BaseController
 *
 * Para segurança, certifique-se de declarar quaisquer novos métodos como protected ou private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instância do objeto Request principal.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * Um array de helpers a serem carregados automaticamente na
     * instanciação da classe. Esses helpers estarão disponíveis
     * para todos os outros controladores que estendem BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Array de variáveis necessárias para o layout.
     *
     * @var array<string, mixed>
     */
    protected $layoutData = [];

    /**
     * Inicializa o controlador.
     *
     * @param RequestInterface $request Instância da requisição.
     * @param ResponseInterface $response Instância da resposta.
     * @param LoggerInterface $logger Instância do logger.
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        // Carregando os dados para o layout
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
    }

    /**
     * Método para carregar a view com os dados do layout.
     *
     * @param string $view Nome da view a ser carregada.
     * @param array $data Dados a serem passados para a view.
     * @return string O conteúdo da view renderizada.
     */
    public function loadView(string $view, array $data = []): string
    {
        // Mescla os dados do layout com os dados específicos da view
        $data = array_merge($this->layoutData, $data);
        return view($view, $data);
    }
}
