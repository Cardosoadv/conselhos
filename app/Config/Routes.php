<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Rotas de Gerenciamento de Permissões
$routes->get('permissoes', 'Permissoes::index', ['filter' => 'permissoes:permissoes.gerenciar']);
$routes->get('permissoes/gerenciar/(:num)', 'Permissoes::gerenciar/$1', ['filter' => 'permissoes:permissoes.gerenciar']);
$routes->post('permissoes/salvar/(:num)', 'Permissoes::salvar/$1', ['filter' => 'permissoes:permissoes.gerenciar']);

// Rotas do Conselho protegidas por permissão
$routes->group('conselho', function ($routes) {
    $routes->get('/', 'Conselho::index', ['filter' => 'permissoes:conselho.visualizar']);
    $routes->get('show/(:any)', 'Conselho::show/$1', ['filter' => 'permissoes:conselho.visualizar']);
    $routes->get('new', 'Conselho::new', ['filter' => 'permissoes:conselho.editar']);
    $routes->post('create', 'Conselho::create', ['filter' => 'permissoes:conselho.editar']);
    $routes->get('edit/(:any)', 'Conselho::edit/$1', ['filter' => 'permissoes:conselho.editar']);
    $routes->put('update/(:any)', 'Conselho::update/$1', ['filter' => 'permissoes:conselho.editar']); // Assuming PUT/PATCH
    $routes->patch('update/(:any)', 'Conselho::update/$1', ['filter' => 'permissoes:conselho.editar']);
    $routes->get('remove/(:any)', 'Conselho::remove/$1', ['filter' => 'permissoes:conselho.deletar']); // Usually remove/delete form
    $routes->delete('delete/(:any)', 'Conselho::delete/$1', ['filter' => 'permissoes:conselho.deletar']);
});

$routes->get('usuarios/imagem/(:num)/(:segment)', 'Usuarios::mostrarImagem/$1/$2');
$routes->get('usuarios/avatar/(:num)', 'Usuarios::avatar/$1');

// Rotas de Usuários protegidas por permissão
$routes->group('usuarios', function ($routes) {
    $routes->get('/', 'Usuarios::index', ['filter' => 'permissoes:usuarios.visualizar']);
    $routes->get('show/(:any)', 'Usuarios::show/$1', ['filter' => 'permissoes:usuarios.visualizar']);
    $routes->get('new', 'Usuarios::new', ['filter' => 'permissoes:usuarios.editar']);
    $routes->post('create', 'Usuarios::create', ['filter' => 'permissoes:usuarios.editar']);
    $routes->get('edit/(:any)', 'Usuarios::edit/$1', ['filter' => 'permissoes:usuarios.editar']);
    $routes->put('update/(:any)', 'Usuarios::update/$1', ['filter' => 'permissoes:usuarios.editar']);
    $routes->patch('update/(:any)', 'Usuarios::update/$1', ['filter' => 'permissoes:usuarios.editar']);
    $routes->delete('delete/(:any)', 'Usuarios::delete/$1', ['filter' => 'permissoes:usuarios.deletar']);
});

// Rotas de Profissionais
$routes->group('profissionais', function ($routes) {
    $routes->get('/', 'Profissionais::index', ['filter' => 'permissoes:profissionais.listar']);
    $routes->get('new', 'Profissionais::new', ['filter' => 'permissoes:profissionais.criar']);
    $routes->post('create', 'Profissionais::create', ['filter' => 'permissoes:profissionais.criar']);
    $routes->get('edit/(:num)', 'Profissionais::edit/$1', ['filter' => 'permissoes:profissionais.editar']);
    $routes->post('update/(:num)', 'Profissionais::update/$1', ['filter' => 'permissoes:profissionais.editar']);
    $routes->get('delete/(:num)', 'Profissionais::delete/$1', ['filter' => 'permissoes:profissionais.excluir']);
    $routes->get('foto/(:num)', 'Profissionais::foto/$1');
});

// Rotas de Profissões
$routes->group('profissoes', function ($routes) {
    $routes->get('/', 'Profissoes::index', ['filter' => 'permissoes:profissoes.listar']);
    $routes->get('new', 'Profissoes::new', ['filter' => 'permissoes:profissoes.criar']);
    $routes->post('create', 'Profissoes::create', ['filter' => 'permissoes:profissoes.criar']);
    $routes->get('edit/(:num)', 'Profissoes::edit/$1', ['filter' => 'permissoes:profissoes.editar']);
    $routes->post('update/(:num)', 'Profissoes::update/$1', ['filter' => 'permissoes:profissoes.editar']);
    $routes->get('delete/(:num)', 'Profissoes::delete/$1', ['filter' => 'permissoes:profissoes.excluir']);
});

service('auth')->routes($routes);
