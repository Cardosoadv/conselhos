<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->resource('conselho');
$routes->resource('profissao');

service('auth')->routes($routes);
