<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->resource('conselho');
$routes->get('usuarios/imagem/(:num)/(:segment)', 'Usuarios::mostrarImagem/$1/$2');
$routes->get('usuarios/avatar/(:num)', 'Usuarios::avatar/$1');
$routes->resource('usuarios');

service('auth')->routes($routes);
